// @ts-check

import { TabSet } from "./TabSet.js";
import { ascensionConfigs } from "./configs/AscensionConfigs.js";
import { createSet, loadSet } from "./Set.js";
import { createAscensionResource } from "./AscensionResource.js";
import { createAscensionUpgrade } from "./AscensionUpgrade.js";
import { createWorld, loadWorld } from "./World.js";
import { stats } from "./Stats.js";

class Ascension {
    constructor (name, inWorld = true) {
        this.constructHTML();

        this.name = name;
        this.inWorld = inWorld;
    }

    initialize ({resources, creatures, upgrades, worlds, activeTab}) {
        this.resources = resources;
        this.creatures = creatures;
        this.upgrades = upgrades;
        this.worlds = worlds;

        this.createTopTabBar(activeTab);
    }

    tick () {
        this.resources.tick();
        this.creatures.tick();
        this.upgrades.tick();
        this.tabs.tick();

        for (const world of this.worlds) {
            world.draw();
        }
    }

    draw () {
        this.resources.draw();
        this.creatures.draw();
        this.upgrades.draw();

        for (const world of this.worlds) {
            world.draw();
        }
    }

    constructHTML () {
        this.worldDiv = document.createElement("div");
        document.getElementById("game").appendChild(this.worldDiv);

        this.worldDiv.className = "world";
        this.worldDiv.innerHTML = `
            <div id="leftpanel" class="game">
                <div id="resources"></div>
            </div>
            <div id="middlepanel" class="game">
                <div id="middiv"></div>
                <div id="middiv2"></div>
                <div id="mousediv"></div>
                <span id="save"></span>
            </div>
            <div id="rightpanel" class="game">
                <div class="tabs" id="tabs"></div>
                <div id="upgrades"></div>
                <div id="creatures"></div>
            </div>
        `;
        /* TODO: maybe put back in if there's any useful info localized to worlds that can't be just in the top tab
                <div id="prestige">
                      <div id="prestigeResourceAmounts"></div>
                      <div id="prestigeInfo"></div>
                </div>
            </div>
        `;
        */
        const leftPanel = this.worldDiv.children[0];
        this.resourceDiv = leftPanel.children[0];

        const middlePanel = this.worldDiv.children[1];

        const rightPanel = this.worldDiv.children[2];
        this.tabDiv = rightPanel.children[0];
        this.upgradeDiv = rightPanel.children[1];
        this.creatureDiv = rightPanel.children[2];
        // this.prestigeDiv = rightPanel.children[3];

        // TODO: more construction
        document.getElementById("anotherOne").onclick = this.anotherOne.bind(this);
    }

    anotherOne () {
        // Add prestige resources
        for (const resource of this.resources) {
            resource.amount += resource.toGain;
        }

        // Fancy transition
        document.body.classList.add("fadeout");

        setTimeout((() => {
            document.body.classList.remove("fadeout");

            // Soft reset
            this.softReset();
        }).bind(this), 1000);
    }

    softReset () {
        document.getElementById("game").innerHTML = "";

        // TODO: pick new worlds and add them here

        // Both of these need to happen after the worlds have been created
        this.createTopTabBar();
        stats.startNewAsc();
    }

    createTopTabBar (activeTab = 0) {
        const tabInfo = [];
        for (let i = 0; i<this.worlds.length; ++i) {
            const world = this.worlds[i];
            tabInfo.push({
                buttonText: `World ${i+1}: ${this.worlds[i].name}`,
                divToShow: world.worldDiv,
                unlockCondition: () => true,
            });
        }
        tabInfo.push({
            buttonText: `Prestige`,
            divToShow: document.getElementById('prestige'),
            unlockCondition: () => {
                // If they've prestiged before, they know the ropes
                console.log(this);
                for (const resource of this.resources.list) {
                    if (resource.amount > 0) {
                        return true;
                    }
                }
                // Unlock when they would be able to get their first okra
                for (const world of this.worlds) {
                    if (world.okraGain > 0) {
                        return true;
                    }
                }
                return false;
            },
        })
        tabInfo.push({
            buttonText: `Achievements`,
            divToShow: document.getElementById('achievements'),
            unlockCondition: () => true,
        })
        tabInfo.push({
            buttonText: `Stats`,
            divToShow: document.getElementById('stats'),
            unlockCondition: () => true,
        })
        tabInfo.push({
            buttonText: `Settings`,
            divToShow: document.getElementById('settings'),
            unlockCondition: () => true,
        })
        this.tabs = new TabSet(tabInfo, document.getElementById("topBar"), activeTab);
    }


    save () {
        const save = {};
        save.r = this.resources.save();
        save.c = this.creatures.save();
        save.u = this.upgrades.save();
        save.n = this.name;
        save.i = this.inWorld;
        save.t = this.tabs.save;
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

    const resources = createSet(config.resourceNames, ascension.resourceDiv, createAscensionResource, ascension);
    // TODO: add back after we've created asc creatures
    //const creatures = createSet(config.creatureNames, ascension.creatureDiv, , ascension);
    const creatures = [];
    const upgrades = createSet(config.upgradeNames, ascension.upgradeDiv, createAscensionUpgrade, ascension);

    const worlds = [];
    for (const worldName of config.baseWorlds) {
        worlds.push(createWorld(worldName));
    }

    ascension.initialize({resources, creatures, upgrades, worlds, activeTab: 0});
    return ascension;
}

function loadAscension (save) {
    const name = save.n;
    const inWorld = save.i;
    const ascension = new Ascension(name, inWorld);
    const activeTab = save.t;

    const resources = loadSet(save.r, ascension.resourceDiv, ascension);
    // TODO: add back after we've created asc creatures
    // const creatures = loadSet(save.c, ascension.creatureDiv, ascension);
    const creatures = [];
    const upgrades = loadSet(save.u, ascension.upgradeDiv, ascension);

    const worlds = [];
    const worldSaves = save.w;
    for (const worldSave of worldSaves) {
        worlds.push(loadWorld(worldSave));
    }

    ascension.initialize({resources, creatures, upgrades, worlds, activeTab});
    return ascension;
}

export { createAscension, loadAscension };
