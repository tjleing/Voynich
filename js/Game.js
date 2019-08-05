// @ts-check

import { WorldCreatureSet } from "./WorldCreatureSet.js";
import { clearNews, News } from "./News.js";
import { clearResources, setFocusedResource, Resource } from "./Resource.js";
import { clearTabs, Tab } from "./Tab.js";
import { clearPrestigeResources, PrestigeResource } from "./PrestigeResource.js";
import { clearAchievements, Achievement } from "./Achievement.js";
import { loadSettings, saveSettings, settings, setSetting, setAllSettings } from "./Settings.js";
import { clearUpgrades, Upgrade } from "./Upgrade.js";
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
            Resource.Map = {};
            this.resources = [];
            this.focusPower = 1; // TODO: put in Stats or something
            clearResources();

            Upgrade.Map = {};
            this.upgrades = [];
            clearUpgrades();

            this.achievements = [];
            clearAchievements();

            PrestigeResource.Map = {};
            this.prestigeResources = [];
            clearPrestigeResources();

            this.tabs = [];
            clearTabs();

            clearNews();

            setAllSettings({"bgColor": "#E82B2B", "fps": 60, "saveTime": 5});

            this.createResources();
            this.createCreatures();
            this.createUpgrades();
            this.createAchievements();
            this.createPrestige();
            this.createTabs();

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
        );
    }

    // TODO rethink naming
    createUpgrades () {
        this.upgrades.push(
            new Upgrade(
                {
                    internalName: "twoForOne",
                    displayName: "Two for one deal!",
                    flavorText: "Everything gets cheaper?",
                    cost: {
                        berries: 100,
                        wood: 100,
                    },
                    effect: () => {
                        for (const creature of this.creatures) {
                            for (const resource in creature.cost) {
                                creature.cost[resource] *= 0.5;
                            }
                        }
                        for (const upgrade of this.upgrades) {
                            for (const resource in upgrade.cost) {
                                upgrade.cost[resource] *= 0.5;
                            }
                        }
                    },
                    unlockCondition: () => {
                        return (Resource.Map["wood"].amount >= 10);
                    },
                }
            )
        );
        this.upgrades.push(
            new Upgrade(
                {
                    internalName: "BeaverineUp1",
                    displayName: "Better dams",
                    flavorText: "Shucks, none of those ideas are good",
                    cost: {
                        berries: 1000,
                        wood: 1000,
                    },
                    effect: () => {
                        this.creatures[1].production["wood"] *= 3;
                    },
                    unlockCondition: () => {
                        var sum = 0;
                        for (const creature of this.creatures.creatureList) {
                            sum += creature.quantity;
                        }
                        return (sum >= 10);
                    },
                }
            )
        );
        this.upgrades.push(
            new Upgrade(
                {
                    internalName: "everythingIsAwful",
                    displayName: "Why would you do this?",
                    flavorText: "Makes everything do nothing",
                    cost: {
                        berries: 10,
                        wood: 10,
                    },
                    effect: () => {
                        for (const creature of this.creatures) {
                            creature.production["wood"] *= 0.001;
                            creature.production["berries"] *= 0.001;
                        }
                    },
                    unlockCondition: () => {
                        return (this.creatures.beaverine.quantity > 0);
                    },
                }
            )
        );
        this.upgrades.push(
            new Upgrade(
                {
                    internalName: "undoAwful",
                    displayName: "You shouldn't have done that",
                    flavorText: "Fixes your mistakes",
                    cost: {
                        berries: 100,
                        wood: 100,
                    },
                    effect: () => {
                        for (const creature of this.creatures) {
                            creature.production["wood"] /= 0.001;
                            creature.production["berries"] /= 0.001;
                        }
                    },
                    unlockCondition: () => {
                        return (this.upgrades[2].purchased);
                    },
                }
            )
        );
        this.upgrades.push(
            new Upgrade(
                {
                    internalName: "greyBG",
                    displayName: "More depressing",
                    flavorText: "Yum! Makes the game more depressing",
                    cost: {
                        berries: 0,
                        wood: 0,
                        flowers: 0,
                    },
                    effect: () => {
                        settings.bgColor = "#888888";
                    },
                    unlockCondition: () => {
                        for (const creature of this.creatures.creatureList) {
                            if (creature.quantity >= 13) return true;
                        }
                        return false;
                    },
                }
            )
        );
        this.upgrades.push(
            new Upgrade(
                {
                    internalName: "getPtroed",
                    displayName: "Skip the whole game",
                    flavorText: "This one's on the hill!",
                    cost: {
                        flowers: 1,
                    },
                    effect: () => {
                        this.creatures[3].quantity++;
                    },
                    unlockCondition: () => {
                        for (const creature of this.creatures.creatureList) {
                            if (creature.quantity > 0) return false;
                        }
                        return true;
                    },
                }
            )
        );
        this.upgrades.push(
            new Upgrade(
                {
                    internalName: "doubleFocusPower",
                    displayName: "Self-immolation",
                    flavorText: "You're on fire! ... Doubles the rate at which you gain resources yourself.",
                    cost: {
                        berries: 10000,
                        wood: 10000,
                    },
                    effect: () => {
                        this.focusPower *= 2;
                    },
                    unlockCondition: () => {
                        return (Resource.Map['wood'].amount >= 1000);
                    },
                }
            )
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
                        return (this.creatures.weaseal.quantity >= 1);
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
                        return (Resource.Map['flowers'].amount >= 1);
                    },
                    effect: () => {
                        Resource.Map['flowers'].amount += 5;
                    },
                }
            )
        );
    }

    // TODO rethink naming
    createResources () {
        this.resources.push(
            new Resource(
                {
                    internalName: "berries",
                    displayNameSingular: "Liquid Gold Berry",
                    displayNamePlural: "Liquid Gold Berries",
                    flavorText: "It's worth its weight in liquid gold berries.",
                    startingAmount: 0,
                    hitpoints: 20,
                    active: true,
                }
            )
        );
        this.resources.push(
            new Resource(
                {
                    internalName: "wood",
                    displayNameSingular: "Branch of Mahogany",
                    displayNamePlural: "Branches of Mahogany",
                    flavorText: "You could carve a nice sculpture out of one of these.",
                    startingAmount: 0,
                    hitpoints: 20,
                    active: true,
                }
            )
        );
        this.resources.push(
            new Resource(
                {
                    internalName: "flowers",
                    displayNameSingular: "Meadow Lily",
                    displayNamePlural: "Meadow Lilies",
                    flavorText: "The rarest flower!",
                    startingAmount: 0,
                    hitpoints: 500,
                    active: true,
                }
            )
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
                    calculateAmountGained: () => {return Resource.Map['wood'].amount;},
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
                    unlockCondition: () => {return Resource.Map["wood"].amount >= 100000;},
                }
            )
        )

        this.tabs[0].setActive();
    }

    tick () {
        for (const resource of this.resources) {
            resource.startTick();
        }

        if (Resource.focusedResource !== undefined) {
            Resource.focusedResource.tickFocus(this.focusPower);
        }

        this.creatures.tick();

        for (const upgrade of this.upgrades) {
            upgrade.tick();
            // TODO: as above, make sure that keeping updateDOM() inside tick() is the right course of action (counter to above)
            // TODO: that does not have much parity, to be honest
        }
        for (const tab of this.tabs) {
            tab.tick();
        }
        for (const achievement of this.achievements) {
            achievement.tick();
        }
        this.news.tick();

        this.draw();

        // bind() to set the this var correctly.
        this.tickTimeout = setTimeout(this.tick.bind(this), 1000 / settings.fps);
    }

    draw () {
        for (const resource of this.resources) {
            resource.draw();
        }

        this.creatures.draw();

        for (const achievement of this.achievements) {
            achievement.draw();
        }

        for (const upgrade of this.upgrades) {
            upgrade.draw();
        }

        for (const prestigeResource of this.prestigeResources) {
            prestigeResource.draw();
        }

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

        save += this.resources.map(resource => resource.save()).join("|");
        save += "||" + (Resource.focusedResource === undefined ? "undefined" : Resource.focusedResource.internalName);
        save += "%%";
        save += JSON.stringify(this.creatures.save());
        save += "%%";
        save += this.upgrades.map(upgrade => upgrade.save()).join("|");
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
        for (let i = 0; i<this.resources.length; ++i) {
            this.resources[i].load(resourcesSave[i]);
        }
        setFocusedResource(Resource.Map[resourceChunks[1]]);

        let creaturesSave = saveComponents[1].split("|");
        this.creatures.load(JSON.parse(creaturesSave));

        let upgradesSave = saveComponents[2].split("|");
        for (let i = 0; i<this.upgrades.length; ++i) {
            this.upgrades[i].load(upgradesSave[i]);
        }

        let achievementsSave = saveComponents[3].split("|");
        for (let i = 0; i<this.achievements.length; ++i) {
            this.achievements[i].load(achievementsSave[i]);
        }

        let settingsSave = saveComponents[4];
        loadSettings(settingsSave);
    }
}

export { Game };
