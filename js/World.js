// @ts-check

import { WorldCreatureSet } from "./WorldCreatureSet.js";
import { WorldResourceSet } from "./WorldResourceSet.js";
import { WorldUpgradeSet } from "./WorldUpgradeSet.js";
import { TabSet } from "./TabSet.js";
import { setAllSettings } from "./Settings.js";

class World {
    constructor ({resourceNames, creatureNames, upgradeNames}) {
        this.constructHTML();

        this.resourceNames = resourceNames;
        this.creatureNames = creatureNames;
        this.upgradeNames = upgradeNames;

        this.focusPower = 1; // TODO: put in Stats or something

        this.resources = new WorldResourceSet(resourceNames, this.resourceDiv, this);
        this.creatures = new WorldCreatureSet(creatureNames, this.creatureDiv, this);
        this.upgrades = new WorldUpgradeSet(upgradeNames, this.upgradeDiv, this);

        //clearNews();

        setAllSettings({"bgColor": "#E82B2B", "fps": 60, "saveTime": 5});

        // TODO: move up probably
        //this.createPrestige();

        this.createTabs();
    }

    createTabs () {
        const tabInfo = [];
        tabInfo.push({
            id: "creatureTab",
            buttonText: "Creatures",
            divToShow: this.creatureDiv,
            unlockCondition: () => {return true;},
        });
        tabInfo.push({
            id: "upgradeTab",
            buttonText: "Upgrades",
            divToShow: this.upgradeDiv,
            unlockCondition: () => {return true;},
        });
        tabInfo.push({
            id: "achievementTab",
            buttonText: "Achievements",
            divToShow: this.achievementDiv,
            unlockCondition: () => {return true;},
        });
        tabInfo.push({
            id: "prestigeTab",
            buttonText: "Another one...",
            divToShow: this.prestigeDiv,
            unlockCondition: () => {return this.resources.wood.amount >= 100000;},
        });

        this.tabs = new TabSet(tabInfo, this.tabDiv, 0, this);
    }

    tick () {
        if (this.resources.focusedResource !== undefined) {
            this.resources.focusedResource.tickFocus(1);
        }
        this.resources.tick();
        this.creatures.tick();
        this.upgrades.tick();
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
                <button>"Mute"</button>
                <button id="import">Load save!</button>
                <button id="export">Export save!</button>
                <button id="hardReset">HARD RESET</button>
                <hr />
                <div class="tabs" id="tabs"></div>
                <div id="upgrades"></div>
                <div id="creatures"></div>
                <div id="achievements"></div>
                <div id="prestige">
                      <div id="prestigeResourceAmounts"></div>
                      <div id="prestigeInfo"></div>
                </div>
            </div>
        `;
        const leftPanel = this.worldDiv.children[0];
        this.resourceDiv = leftPanel.children[0];

        const middlePanel = this.worldDiv.children[1];
        // TODO: news div?

        const rightPanel = this.worldDiv.children[2];
        this.tabDiv = rightPanel.children[5];
        this.upgradeDiv = rightPanel.children[6];
        this.creatureDiv = rightPanel.children[7];
        this.achievementDiv = rightPanel.children[8];
        this.prestigeDiv = rightPanel.children[9];
    }

    save () {
        const save = {};
        save["resources"] = this.resources.save();
        save["focusedResource"] = this.resources.focusedResource === undefined ? "undefined" : this.resources.focusedResource.internalName;
        save["creatures"] = this.creatures.save();
        save["upgrades"] = this.upgrades.save();
        return save;
    }

    load (save) {
        // TODO: hecking constructor vs. load..... fml
        this.resources.load(save["resources"]);
        if (this.resources.setFocusedResource !== "undefined") {
            this.resources.setFocusedResource(save["focusedResource"]);
        }
        this.creatures.load(save["creatures"]);
        this.upgrades.load(save["upgrades"]);
    }
}

const worldConfigs = {
    lush: {
        resourceNames: ["berries", "wood", "flowers"],
        creatureNames: ["weaseal", "beaverine", "buckaroo", "ptrocanfer"],
        upgradeNames: ["twoForOne", "BeaverineUp1", "everythingIsAwful", "undoAwful", "greyBG", "getPtroed", "doubleFocusPower"],
    },
};

function createWorld (name) {
    return new World(worldConfigs[name]);
}

export { createWorld };
