// @ts-check

import { TabSet } from "./TabSet.js";
import { ascensionConfigs } from "./configs/AscensionConfigs.js";
import { createSet, loadSet } from "./Set.js";
import { createAscensionResource, loadAscensionResource } from "./AscensionResource.js";
import { createAscensionUpgrade, loadAscensionUpgrade } from "./AscensionUpgrade.js";
import { createWorld, loadWorld } from "./World.js";
import { stats } from "./Stats.js";

class Ascension {
    constructor (name) {
        this.constructDOM();

        this.name = name;
    }

    initialize ({resources, creatures, upgrades, worlds, activeTab}) {
        this.resources = resources;
        this.creatures = creatures;
        this.upgrades = upgrades;
        this.worlds = worlds;

        let worldTab = undefined, ascensionTab = undefined;
        if (this.worlds === []) {
            ascensionTab = activeTab;
        }
        else {
            worldTab = activeTab;
        }
        this.createWorldTabBar(worldTab);
        this.createAscensionTabBar(ascensionTab);
        this.setVisibility();
    }

    calculateMultiplier () {
        // TODO: actual calculation
        return this.resources["okra"].amount + 1;
    }

    tick () {
        this.resources.tick();
        //this.creatures.tick();
        this.upgrades.tick();
        this.worldTabs.tick();
        this.ascensionTabs.tick();

        for (const world of this.worlds) {
            world.tick();
        }
    }

    draw () {
        this.resources.draw();
        //this.creatures.draw();
        this.upgrades.draw();

        for (const world of this.worlds) {
            world.draw();
        }
    }

    setVisibility () {
        const ascContainer = document.getElementById("ascensionContainer");
        const worldContainer = document.getElementById("worldLevelContainer");
        ascContainer.style.display = "none";
        worldContainer.style.display = "none";

        if (this.worlds.length === 0) {
            // We're in ascension level
            ascContainer.style.display = "inherit";
        }
        else {
            // We're in world level
            worldContainer.style.display = "inherit";
        }
    }

    constructDOM () {
        this.constructAscensionDOM();
        this.constructWorldDOM();
    }

    constructAscensionDOM () {
        this.ascensionDiv = document.getElementById("ascension");

        this.marketDiv = this.ascensionDiv.children[0];
        this.resourceDiv = this.marketDiv.children[0];
        this.upgradeDiv = this.marketDiv.children[1];
        // TODO: this.creatures = this.marketDiv.children[2]
        // or something

        this.shrineDiv = this.ascensionDiv.children[1];
        this.selectionDiv = this.ascensionDiv.children[2];
    }

    constructWorldDOM () {
        this.worldLevelDiv = document.getElementById("worldLevel");
        this.worldAscensionDiv = document.getElementById("worldAscension");
        this.worldAscensionResourcesDiv = this.worldAscensionDiv.children[0];

        document.getElementById("anotherOne").onclick = this.anotherOne.bind(this);
    }

    anotherOne () {
        // Add prestige resources
        for (const resource of this.resources.list) {
            resource.amount += resource.toGain;
            // For visual purposes only: gain is visible while fading out, so
            // show that the gain has occurred by clearing out the gain
            resource.toGain = 0;
        }

        // Fancy transition
        document.body.classList.add("fadeout");

        setTimeout((() => {
            document.body.classList.remove("fadeout");

            // Up to ascension screen
            this.softReset();
            this.setVisibility();
        }).bind(this), 1000);
    }

    softReset () {
        document.getElementById("worldLevel").innerHTML = "";

        this.constructWorldDOM();

        // TODO: pick new worlds
        const config = ascensionConfigs[this.name];
        this.worlds = [];
        for (const worldName of config.baseWorlds) {
            this.worlds.push(createWorld(worldName, this));
        }

        // Both of these need to happen after the worlds have been created
        this.createWorldTabBar();
        this.createAscensionTabBar();
        stats.startNewAsc();
    }

    createWorldTabBar (activeTab = 0) {
        const worldTabInfo = [];
        for (let i = 0; i<this.worlds.length; ++i) {
            const world = this.worlds[i];
            worldTabInfo.push({
                buttonText: `World ${i+1}: ${this.worlds[i].name}`,
                divToShow: world.worldDiv,
                unlockCondition: () => true,
            });
        }
        worldTabInfo.push({
            buttonText: `Prestige`,
            divToShow: this.worldAscensionDiv,
            unlockCondition: () => {
                // TODO: what if they had okra but have spent it all?
                for (const resource of this.resources.list) {
                    // If they've prestiged before, they know the ropes
                    // Also unlock when they can get their first okra
                    // TODO: need to finish all worlds to prestige
                    if (resource.amount > 0 || resource.toGain > 0) {
                        return true;
                    }
                }

                return false;
            },
        })
        worldTabInfo.push({
            buttonText: `Achievements`,
            divToShow: document.getElementById('achievements'),
            unlockCondition: () => true,
        })
        worldTabInfo.push({
            buttonText: `Stats`,
            divToShow: document.getElementById('stats'),
            unlockCondition: () => true,
        })
        worldTabInfo.push({
            buttonText: `Settings`,
            divToShow: document.getElementById('settings'),
            unlockCondition: () => true,
        })
        const topBar = document.getElementById("worldLevelTabs");
        this.worldTabs = new TabSet(worldTabInfo, topBar, activeTab);
    }

    createAscensionTabBar (activeTab = 0) {
        const ascensionTabInfo = [];
        ascensionTabInfo.push({
            buttonText: `Market`,
            divToShow: this.marketDiv,
            unlockCondition: () => true,
        });
        ascensionTabInfo.push({
            buttonText: `Shrines`,
            divToShow: this.shrineDiv,
            // TODO: probably an upgrade or just after buying relics?
            unlockCondition: () => true,
        });
        ascensionTabInfo.push({
            buttonText: `World Selection`,
            divToShow: this.selectionDiv,
            unlockCondition: () => true,
        });
        ascensionTabInfo.push({
            buttonText: `Achievements`,
            divToShow: document.getElementById('achievements'),
            unlockCondition: () => true,
        })
        ascensionTabInfo.push({
            buttonText: `Stats`,
            divToShow: document.getElementById('stats'),
            unlockCondition: () => true,
        })
        ascensionTabInfo.push({
            buttonText: `Settings`,
            divToShow: document.getElementById('settings'),
            unlockCondition: () => true,
        })
        const topBar = document.getElementById("ascensionLevelTabs");
        this.ascensionTabs = new TabSet(ascensionTabInfo, topBar, activeTab);
    }



    save () {
        const save = {};
        save.r = this.resources.save();
        //save.c = this.creatures.save();
        save.u = this.upgrades.save();
        save.n = this.name;
        if (this.worlds.length === 0) {
            save.t = this.ascensionTabs.save();
        }
        else {
            save.t = this.worldTabs.save();
        }
        save.w = [];
        for (const world of this.worlds) {
            save.w.push(world.save());
        }
        return save;
    }
}


function createAscension (name) {
    const ascension = new Ascension(name);

    const config = ascensionConfigs[name];

    // TODO: helper functions for these just like we did for WorldResource?
    const resources = createSet(config.resourceNames, ascension.resourceDiv, createAscensionResource, ascension);
    // TODO: add back after we've created asc creatures
    //const creatures = createSet(config.creatureNames, ascension.creatureDiv, , ascension);
    const creatures = [];
    const upgrades = createSet(config.upgradeNames, ascension.upgradeDiv, createAscensionUpgrade, ascension);

    const worlds = [];
    for (const worldName of config.baseWorlds) {
        worlds.push(createWorld(worldName, ascension));
    }

    ascension.initialize({resources, creatures, upgrades, worlds, activeTab: 0});
    return ascension;
}

function loadAscension (save) {
    const name = save.n;
    const ascension = new Ascension(name);
    const activeTab = save.t;

    const resources = loadSet(save.r, ascension.resourceDiv, loadAscensionResource, ascension);
    // TODO: add back after we've created asc creatures
    // const creatures = loadSet(save.c, ascension.creatureDiv, ascension);
    const creatures = [];
    const upgrades = loadSet(save.u, ascension.upgradeDiv, loadAscensionUpgrade, ascension);

    const worlds = [];
    const worldSaves = save.w;
    for (const worldSave of worldSaves) {
        worlds.push(loadWorld(worldSave, ascension));
    }

    ascension.initialize({resources, creatures, upgrades, worlds, activeTab});
    return ascension;
}

export { createAscension, loadAscension };
