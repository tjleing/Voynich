// @ts-check

import { createWorld, loadWorld } from "./World.js";
import { clearPrestigeResources, PrestigeResource } from "./PrestigeResource.js";
import { clearAchievements, Achievement } from "./Achievement.js";
import { loadSettings, saveSettings, settings, setSetting, setAllSettings } from "./Settings.js";
import { TabSet } from "./TabSet.js";
import { fix, notify } from "./Utils.js";

class Game {
    constructor () {
        //this.hardReset(false);
        this.prep();

        /*
        // Create stat div on left panel
        this.statDiv = document.createElement("div");
        this.statDiv.id = this.id + "stats";
        var leftpanel = document.getElementById("leftpanel");
        leftpanel.appendChild(this.statDiv);
        */
    }

    prep () {
        this.worlds = [];
        document.getElementById("game").innerHTML = "";

        this.achievements = [];
        this.createAchievements();
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
            this.worlds.push(createWorld("lush"));
            this.worlds.push(createWorld("lush"));

            this.createTopTabBar();

            this.achievements = [];
            clearAchievements();

            PrestigeResource.Map = {};
            this.prestigeResources = [];
            clearPrestigeResources();

            setAllSettings({"bgColor": "#E82B2B", "fps": 20, "saveTime": 20});

            //this.createResources();
            //this.createCreatures();
            //this.createUpgrades();
            this.createAchievements();
            this.createPrestige();
            //this.createTabs();
        }
    }

    // TODO rethink naming
    /*
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
    */

    // TODO rethink naming
    /*
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
    */

    createAchievements () {
        this.achievements.push(
            new Achievement(
                {
                    displayName: "We'll seal you later!",
                    lockedFlavorText: "Hmm... maybe there's a creature with a name like that",
                    unlockedFlavorText: "In fact, we'll seal you now!",
                    unlockCondition: () => {
                        for (const world of this.worlds) {
                            if (world.creatures.weaseal.quantity >= 1)
                                return true;
                        }
                        return false;
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
                        for (const world of this.worlds) {
                            if (world.resources.flowers.amount >= 1)
                                return true;
                        }
                        return false;
                    },
                    effect: () => {
                        this.worlds[0].resources.flowers.amount += 5;
                    },
                }
            )
        );
        this.achievements.push(
            new Achievement(
                {
                    displayName: "Mmmm, steak sauce",
                    lockedFlavorText: "Smells prestigous... you could say it's known for its excellence",
                    unlockedFlavorText: "Yes our naming scheme is terrible, who even came up with 'A1,' seriously",
                    unlockCondition: () => {
                        for (const world of this.worlds) {
                            // TODO: fix, this isn't the right unlock
                            if (world.resources.flowers.amount >= 1)
                                return true;
                        }
                        return false;
                    },
                    effect: () => {},
                }
            )
        );
    }

    // TODO rethink naming
    /*
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
    */

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

    createTopTabBar () {
        const tabInfo = [];
        for (let i = 0; i<this.worlds.length; ++i) {
            const world = this.worlds[i];
            tabInfo.push({
                buttonText: `World ${i}`,
                divToShow: world.worldDiv,
                unlockCondition: () => true,
            });
        }
        tabInfo.push({
            buttonText: `Achievements`,
            divToShow: document.getElementById('achievements'),
            unlockCondition: () => true,
        })
        tabInfo.push({
            buttonText: `Settings`,
            divToShow: document.getElementById('settings'),
            unlockCondition: () => true,
        })
        this.tabs = new TabSet(tabInfo, document.getElementById("topBar"), 0, undefined);
    }

    /*createTabs () {
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
    }*/

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
        */

        for (const world of this.worlds) {
            world.tick();
        }
        
        for (const achievement of this.achievements) {
            achievement.tick();
        }

        this.draw();

        // bind() to set the this var correctly.
        this.tickTimeout = setTimeout(this.tick.bind(this), 1000 / settings.fps);
    }

    draw () {
        /*
        this.resources.draw();

        this.creatures.draw();
        */

        for (const achievement of this.achievements) {
            achievement.draw();
        }
        
        /*
        this.upgrades.draw();

        for (const prestigeResource of this.prestigeResources) {
            prestigeResource.draw();
        }
        */
        for (const world of this.worlds) {
            world.draw();
        }

        document.body.style.backgroundColor = settings.bgColor;
    }

    // TODO: modifiers to buy max or multiple, etc.; also visual indicator for such
    // TODO: figure out what to do if there's 10 or more creature types?
    handleKey (key) {
        if (key >= "1" && key <= this.worlds[0].creatures.creatureList.length.toString()) {
            this.worlds[0].creatures.creatureList[parseInt(key)-1].buy();
        }
    }

    // PRESTIGE
    prestige () {
        // Confirmation dialog box?

        // Draw the prestige menu
        // + animations if we ever have any
        document.getElementById("game").style.visibility = "false";
        document.getElementById("prestige").style.visibility = "true";

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
        // Combine save objects from each world + global saves
        let save = {};

        let worldSaves = [];
        for (const world of this.worlds) {
            worldSaves.push(world.save());
        }
        save["w"] = worldSaves;

        save["a"] = this.achievements.map(achievement => achievement.save()).join("|");
        save["s"] = saveSettings();

        save["t"] = this.tabs.save();

        // Save it to localStorage, base64-encoded
        localStorage.setItem("save", btoa(JSON.stringify(save)));
    }

    load () {
        // Get save string from localStorage
        const save = localStorage.getItem("save");

        try {
            this.loadSave(save);
        }
        catch (error) {
            // Invalid or missing save
            console.log(error);
            this.hardReset();
        }
    }

    importSave () {
        this.save();
        const oldSave = localStorage.getItem("save"); // To restore back to if the new save is invalid
        const newSave = prompt("Paste your save (your current save will be overwritten)!");

        document.getElementById("game").innerHTML = "";

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
        save = JSON.parse(atob(save));

        // Initialize everything from the save string

        const worldSaves = save.w;
        this.worlds = [];
        for (const worldSave of worldSaves) {
            const world = loadWorld(worldSave);
            this.worlds.push(world);
        }
        this.createTopTabBar();

        this.tabs.load(save.t);

        /*
        let saveComponents = save.split("%%");

        let resourceChunks = saveComponents[0].split("||");
        let resourcesSave = resourceChunks[0].split("|");
        this.resources.load(resourcesSave);
        this.resources.setFocusedResource(this.resources[resourceChunks[1]]);

        let creaturesSave = saveComponents[1].split("|");
        this.creatures.load(JSON.parse(creaturesSave));

        let upgradesSave = saveComponents[2].split("|");
        this.upgrades.load(upgradesSave);
        */

        let achievementsSave = save.a.split("|");
        for (let i = 0; i<this.achievements.length; ++i) {
            this.achievements[i].load(achievementsSave[i]);
        }

        let settingsSave = save.s;
        loadSettings(settingsSave);
    }
}

export { Game };
