// @ts-check

import { TabSet } from "./TabSet.js";
import { ascensionConfigs } from "./configs/AscensionConfigs.js";
import { createSet, loadSet } from "./Set.js";
import { createAscensionResource, loadAscensionResource } from "./AscensionResource.js";
import { createAscensionUpgrade, loadAscensionUpgrade } from "./AscensionUpgrade.js";
import { createWorld, loadWorld } from "./World.js";
import { stats } from "./Stats.js";
import { setSetting } from "./Settings.js";
import { createWorldSelection, loadWorldSelection } from "./WorldSelection.js";

class Ascension {
    constructor (name) {
        this.name = name;
        this.worldCount = 2;
        this.worldTypeSelects = [];
        this.worldDifficultySelects = [];

        this.constructDOM();
    }

    initialize ({resources, creatures, upgrades, worlds, worldSelection, activeTab}) {
        this.resources = resources;
        this.creatures = creatures;
        this.upgrades = upgrades;
        this.worlds = worlds;
        this.worldSelection = worldSelection;

        // backwards (not utilizing constructor) because divs are used in both
        // tab bars, so we construct to set everything invis and then only set up
        // the one we need
        this.createWorldTabBar(0);
        this.createAscensionTabBar(0);
        if (this.worlds.length === 0) {
            this.ascensionTabs.setActive(activeTab);
        }
        else {
            this.worldTabs.setActive(activeTab);
        }
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
        this.worldOptionsDiv = document.getElementById("worldOptions");

        document.getElementById("descend").onclick = this.descend.bind(this);
    }

    constructWorldDOM () {
        this.worldLevelDiv = document.getElementById("worldLevel");
        this.worldAscensionDiv = document.getElementById("worldAscension");
        this.worldAscensionResourcesDiv = this.worldAscensionDiv.children[0];

        document.getElementById("ascend").onclick = this.ascend.bind(this);
    }

    ascend () {
        // Add prestige resources
        var gainFunctionBackups = {};
        for (const resource of this.resources.list) {
            resource.amount += resource.toGain;
            // For visual purposes only: gain is visible while fading out, so
            // show that the gain has occurred by clearing out the gain
            resource.toGain = 0;
            gainFunctionBackups[resource.name] = resource.calculateGain;
            resource.calculateGain = function (){return 0;};
            resource.draw();
        }

        // Disable button so you can't click it twice
        document.getElementById("ascend").onclick = function() {};

        // Fancy transition
        document.body.classList.add("fadeout");
        document.body.classList.add("up");

        setTimeout((() => {
            document.body.classList.remove("fadeout");
            document.body.classList.remove("up");
            setSetting("bgColor", "#2BE88B");

            // Up to ascension screen
            this.worlds = [];
            this.setVisibility();

            for (const resource of this.resources.list) {
                resource.calculateGain = gainFunctionBackups[resource.name];
            }

            // Reenable button
            document.getElementById("ascend").onclick = this.ascend.bind(this);
        }).bind(this), 1000);
    }

    descend () {
        // Disable button so you can't click it twice
        document.getElementById("descend").onclick = function() {};

        // Fancy transition
        document.body.classList.add("fadeout");
        document.body.classList.add("down");

        setTimeout((() => {
            document.body.classList.remove("fadeout");
            document.body.classList.remove("down");

            document.getElementById("worldLevel").innerHTML = "";
            setSetting("bgColor", "#E82B2B");
            // TODO: pick new worlds
            const config = ascensionConfigs[this.name];
            this.worlds = [];
            for (let i = 0; i<this.worldSelection.typeSelects.length; ++i) {
                const worldName = this.worldSelection.typeSelects[i].value;
                const worldDifficulty = this.worldSelection.difficultySelects[i].value;
                this.worlds.push(createWorld(worldName, worldDifficulty, this));
            }

            this.constructWorldDOM();

            // Both of these need to happen after the worlds have been created
            this.createWorldTabBar();
            this.setVisibility();

            stats.startNewAsc();

            // Down to world level screen
            this.setVisibility();

            // Reenable button
            document.getElementById("descend").onclick = this.descend.bind(this);
        }).bind(this), 1000);
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

    handleKey (key) {
        const idx = this.worldTabs.activeIndex;
        if (idx < this.worlds.length) {
            if (key >= "1" && key <= this.worlds[idx].creatures.list.length.toString()) {
                this.worlds[idx].creatures.list[parseInt(key)-1].buy();
            }
        }
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

        save.s = this.worldSelection.save();

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
        worlds.push(createWorld(worldName, 1, ascension));
    }

    const worldSelection = createWorldSelection(ascension.worldOptionsDiv);

    ascension.initialize({resources, creatures, upgrades, worlds, worldSelection, activeTab: 0});
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

    const worldSelection = loadWorldSelection(save.s, ascension.worldOptionsDiv);

    ascension.initialize({resources, creatures, upgrades, worlds, worldSelection, activeTab});
    return ascension;
}

export { createAscension, loadAscension };
