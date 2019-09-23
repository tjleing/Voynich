// @ts-check

import { createWorldCreatureSet, loadWorldCreatureSet } from "./WorldCreatureSet.js";
import { createWorldResourceSet, loadWorldResourceSet } from "./WorldResourceSet.js";
import { createWorldUpgradeSet, loadWorldUpgradeSet } from "./WorldUpgradeSet.js";
import { TabSet } from "./TabSet.js";
import { setAllSettings } from "./Settings.js";

class World {
    constructor (name, okraGain) {
        this.constructHTML();

        this.name = name;
        this.focusPower = 1; // TODO: put in Stats or something
        this.okraGain = okraGain; // TODO: scrap in prestige PR plz

        setAllSettings({"bgColor": "#E82B2B", "fps": 60, "saveTime": 5});

        // TODO: move up probably
        //this.createPrestige();

    }

    initialize ({resources, creatures, upgrades}) {
        this.resources = resources;
        this.creatures = creatures;
        this.upgrades = upgrades;

        this.createTabs();
    }

    createTabs () {
        const tabInfo = [];
        tabInfo.push({
            buttonText: "Creatures",
            divToShow: this.creatureDiv,
            unlockCondition: () => {return true;},
        });
        tabInfo.push({
            buttonText: "Upgrades",
            divToShow: this.upgradeDiv,
            unlockCondition: () => {return true;},
        });
        /*
        tabInfo.push({
            buttonText: "Another one...",
            divToShow: this.prestigeDiv,
            unlockCondition: () => {return this.resources.wood.amount >= 100000;},
        });
        */

        this.tabs = new TabSet(tabInfo, this.tabDiv, 0, this);
    }

    tick () {
        this.resources.tick();
        if (this.resources.focusedResource !== undefined) {
            this.resources.focusedResource.tickFocus(1);
        }
        this.creatures.tick();
        this.upgrades.tick();
        this.tabs.tick();
    }

    draw () {
        this.resources.draw();
        this.creatures.draw();
        this.upgrades.draw();
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
    }

    save () {
        const save = {};
        save.r = this.resources.save();
        save.c = this.creatures.save();
        save.u = this.upgrades.save();
        save.n = this.name;
        save.o = this.okraGain;
        return save;
    }
}

const worldConfigs = {
    lush: {
        resourceNames: ["berries", "wood", "flowers"],
        creatureNames: ["weaseal", "beaverine", "buckaroo", "ptrocanfer"],
        upgradeNames: ["twoForOne", "BeaverineUp1", "everythingIsAwful", "undoAwful", "greyBG", "getPtroed", "doubleFocusPower", "lushOkra0", "lushOkra1", "lushOkra2"],
    },
    wooded: {
        resourceNames: ["amber", "maplesyrup", "spamber", "wood"],
        creatureNames: ["ambear", "spicewolf", "chuckpecker", "tasdevil"],
        upgradeNames: ["woodedOkra1", "woodedOkra2"],
    },
};

function createWorld (name) {
    const world = new World(name, 0);

    const config = worldConfigs[name];
    const resources = createWorldResourceSet(config.resourceNames, world.resourceDiv, world);
    const creatures = createWorldCreatureSet(config.creatureNames, world.creatureDiv, world);
    const upgrades = createWorldUpgradeSet(config.upgradeNames, world.upgradeDiv, world);

    world.initialize({resources, creatures, upgrades});
    return world;
}

function loadWorld (save) {
    const name = save.n;
    const okraGain = save.o;
    const world = new World(name, okraGain);

    const resources = loadWorldResourceSet(save.r, world.resourceDiv, world);
    const creatures = loadWorldCreatureSet(save.c, world.creatureDiv, world);
    const upgrades = loadWorldUpgradeSet(save.u, world.upgradeDiv, world);

    world.initialize({resources, creatures, upgrades});
    return world;
}

export { createWorld, loadWorld };
