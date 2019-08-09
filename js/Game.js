// @ts-check

import { WorldCreatureSet } from "./WorldCreatureSet.js";
import { clearNews, News } from "./News.js";
import { WorldResourceSet } from "./WorldResourceSet.js";
import { World } from "./World.js";
import { clearPrestigeResources, PrestigeResource } from "./PrestigeResource.js";
import { clearAchievements, Achievement } from "./Achievement.js";
import { loadSettings, saveSettings, settings, setSetting, setAllSettings } from "./Settings.js";
import { WorldUpgradeSet } from "./WorldUpgradeSet.js";
import { fix, notify } from "./Utils.js";

class Game {
    constructor () {
        this.hardReset(false);

        // Create stat div on left panel
        this.statDiv = document.createElement("div");
        this.statDiv.id = this.id + "stats";
        var leftpanel = document.getElementById("leftpanel");
        leftpanel.appendChild(this.statDiv);
    }

    hardReset (prompt) {
        // Clears out all of the static variables for all of these classes and then refills them
        // with the values in this.create____.
        // Counterintuitively, this is called at startup, so we can put "initialization code"
        // (i.e. ._counter = 0, ._buttons = [], ...) in clearResources(), clearCreatures(), etc.
        // Now that's good design.
        // TODO: abstract it all out into its own function so that we're not literally hardReset()ing
        // on every single refresh
        if (!prompt || confirm("Are you sure that you want to erase all your progress?")) {
            this.focusPower = 1; // TODO: put in Stats or something

            //clearWorlds();
            document.getElementById("game").innerHTML = "";
            this.worlds = [];
            this.worlds.push(new World({
                resourceNames: ["berries", "wood", "flowers"],
                creatureNames: ["weaseal", "beaverine", "buckaroo", "ptrocanfer"],
                upgradeNames: ["twoForOne", "BeaverineUp1", "everythingIsAwful", "undoAwful", "greyBG", "getPtroed", "doubleFocusPower"],
            }));

            this.achievements = [];
            clearAchievements();

            PrestigeResource.Map = {};
            this.prestigeResources = [];
            clearPrestigeResources();

            clearNews();

            setAllSettings({"bgColor": "#E82B2B", "fps": 20, "saveTime": 20});

            //this.createResources();
            //this.createCreatures();
            //this.createUpgrades();
            this.createAchievements();
            this.createPrestige();
            //this.createTabs();


            this.news = new News();
        }
    }

    // TODO rethink naming
    createCreatures () {
        if (this.creatures) {
            this.creatures.clear();
        }
        this.creatures = new WorldCreatureSet(
            ["weaseal", "beaverine", "buckaroo", "ptrocanfer"],
            document.getElementById("creatures"),
            this,
        );
    }

    // TODO rethink naming
    createUpgrades () {
        if (this.upgrades) {
            this.upgrades.clear();
        }
        this.upgrades = new WorldUpgradeSet(
            ["twoForOne", "BeaverineUp1", "everythingIsAwful", "undoAwful", "greyBG", "getPtroed", "doubleFocusPower"],
            document.getElementById("upgrades"),
            this,
        );
    }

    createAchievements () {
        this.achievements.push(
            new Achievement(
                {
                    displayName: "We'll seal you later!",
                    lockedFlavorText: "Hmm... maybe there's a creature with a name like that",
                    unlockedFlavorText: "In fact, we'll seal you now!",
                    unlockCondition: () => {
                        console.log(this);
                        return (this.worlds[0].creatures.weaseal.quantity >= 1);
                    },
                    effect: () => {},
                }
            )
        );
        this.achievements.push(
            new Achievement(
                {
                    displayName: "The smallest e",
                    lockedFlavorText: "Is this one a pun too?",
                    unlockedFlavorText: "Lil' e, sounds like a rapper!  Shucks that was terrible",
                    unlockCondition: () => {
                        return (this.worlds[0].resources.flowers.amount >= 1);
                    },
                    effect: () => {
                        this.worlds[0].resources.flowers.amount += 5;
                    },
                }
            )
        );
    }

    // TODO rethink naming
    createResources () {
        if (this.resources) {
            this.resources.clear();
        }
        this.resources = new WorldResourceSet(
            ["berries", "wood", "flowers"],
            document.getElementById("resources"),
            this,
        );
    }

    createPrestige () {
        this.prestigeResources.push(
            new PrestigeResource(
                {
                    internalName: "okra",
                    displayNameSingular: "Okra",
                    displayNamePlural: "Okra",
                    flavorText: "The perfect solution to the world's drought!",
                    startingAmount: 0,
                    calculateAmountGained: () => {return this.resources.wood.amount;},
                    active: true,
                }
            )
        );
    }

    createTabs () {
        this.tabs.push(
            new Tab(
                {
                    id: "creatureTab",
                    buttonText: "Creatures",
                    divToShow: document.getElementById("creatures"),
                    unlockCondition: () => {return true;},
                }
            )
        )
        this.tabs.push(
            new Tab(
                {
                    id: "upgradeTab",
                    buttonText: "Upgrades",
                    divToShow: document.getElementById("upgrades"),
                    unlockCondition: () => {return true;},
                }
            )
        )
        this.tabs.push(
            new Tab(
                {
                    id: "achievementTab",
                    buttonText: "Achievements",
                    divToShow: document.getElementById("achievements"),
                    unlockCondition: () => {return true;},
                }
            )
        )
        this.tabs.push(
            new Tab(
                {
                    id: "prestigeTab",
                    buttonText: "Another one...",
                    divToShow: document.getElementById("prestige"),
                    unlockCondition: () => {return this.resources.wood.amount >= 100000;},
                }
            )
        )

        this.tabs[0].setActive();
    }

    tick () {
        /*
        this.resources.tick();

        if (this.resources.focusedResource !== undefined) {
            this.resources.focusedResource.tickFocus(this.focusPower);
        }

        this.creatures.tick();

        this.upgrades.tick();

        for (const tab of this.tabs) {
            tab.tick();
        }
        for (const achievement of this.achievements) {
            achievement.tick();
        }
        this.news.tick();
        */
        this.worlds[0].tick();

        this.draw();

        // bind() to set the this var correctly.
        this.tickTimeout = setTimeout(this.tick.bind(this), 1000 / settings.fps);
    }

    draw () {
        /*
        this.resources.draw();

        this.creatures.draw();

        for (const achievement of this.achievements) {
            achievement.draw();
        }

        this.upgrades.draw();

        for (const prestigeResource of this.prestigeResources) {
            prestigeResource.draw();
        }
        */
        this.worlds[0].draw();

        document.body.style.backgroundColor = settings.bgColor;
    }

    // TODO: modifiers to buy max or multiple, etc.; also visual indicator for such
    // TODO: figure out what to do if there's 10 or more creature types?
    handleKey (key) {
        if (key >= "1" && key <= this.creatures.creatureList.length.toString()) {
            this.creatures.creatureList[parseInt(key)-1].buy();
        }
    }

    // PRESTIGE
    prestige () {
        // Confirmation dialog box?

        // Draw the prestige menu
        // + animations if we ever have any
        document.getElementById("game").style.visibility = false;
        document.getElementById("prestige").style.visibility = true;

        // Stop tick cycle and save cycle
        clearTimeout(this.tickTimeout);
        //clearTimeout(this.saveTimeout);

        for (const prestigeResource of this.prestigeResources) {
            prestigeResource.amount += prestigeResource.calculateAmountGained();
        }

        // this.softReset();
        // Or maybe just clear this.worlds...
    }

    prestigeReturn () {
        // Generate a tab for each world
        // Generate each world

        // Resume tick and save
        this.tick();
        this.save();
    }

    // SAVING AND LOADING
    save () {
        // Get save string by concatenating all of the game state's save strings
        let save = "";

        save += this.resources.resourceList.map(resource => resource.save()).join("|");
        save += "||" + (this.resources.focusedResource === undefined ? "undefined" : this.resources.focusedResource.internalName);
        save += "%%";
        save += JSON.stringify(this.creatures.save());
        save += "%%";
        save += this.upgrades.upgradeList.map(upgrade => upgrade.save()).join("|");
        save += "%%";
        save += this.achievements.map(achievement => achievement.save()).join("|");
        save += "%%";
        save += saveSettings();

        // Save it to localStorage, base64-encoded
        localStorage.setItem("save", btoa(save));
    }

    load () {
        // Get save string from localStorage
        const save = localStorage.getItem("save");
        if (!save) {
            // There is no save file, just break out
            return;
        }
        try {
            this.loadSave(save);
        }
        catch (error) {
            this.hardReset();
        }
    }

    importSave () {
        this.save();
        const oldSave = localStorage.getItem("save"); // To restore back to if the new save is invalid
        const newSave = prompt("Paste your save (your current save will be overwritten)!");

        try {
            this.loadSave(newSave);
            setTimeout(function () { notify("Save loaded"); }, 300);
        }
        catch (error) {
            this.loadSave(oldSave);
            setTimeout(function () { notify("Invalid save"); }, 300);
        }
        // About the strange setTimeouts: prompt() blurs and refocuses the page, which clears the Noty notifications
        // so that there's not an extra backlog waiting for a user after being off the page for a long time.  Moreover
        // it seems that the blur and refocus events are called a fair amount after the prompt is closed?  In any case,
        // 300 ms after the prompt is closed, notifications can be sent.
    }

    exportSave () {
        this.save();
        const save = localStorage.getItem("save");

        const saveTextArea = document.createElement("textarea");
        saveTextArea.value = save;
        document.body.appendChild(saveTextArea);
        saveTextArea.focus();
        saveTextArea.select();

        try {
            var successful = document.execCommand("copy");
            var msg = successful ? "successful" : "unsuccessful";
            notify("Save exported to clipboard");
        } catch (err) {
            notify("Unable to copy save");
        }

        document.body.removeChild(saveTextArea);
    }

    loadSave (save) {
        // base-64 decode
        save = atob(save);

        // Initialize everything from the save string
        let saveComponents = save.split("%%");

        let resourceChunks = saveComponents[0].split("||");
        let resourcesSave = resourceChunks[0].split("|");
        this.resources.load(resourcesSave);
        this.resources.setFocusedResource(this.resources[resourceChunks[1]]);

        let creaturesSave = saveComponents[1].split("|");
        this.creatures.load(JSON.parse(creaturesSave));

        let upgradesSave = saveComponents[2].split("|");
        this.upgrades.load(upgradesSave);

        let achievementsSave = saveComponents[3].split("|");
        for (let i = 0; i<this.achievements.length; ++i) {
            this.achievements[i].load(achievementsSave[i]);
        }

        let settingsSave = saveComponents[4];
        loadSettings(settingsSave);
    }
}

export { Game };
