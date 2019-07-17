// @ts-check

import { clearCreatures, Creature } from "./Creature.js";
import { clearNews, News } from "./News.js";
import { clearResources, setFocusedResource, Resource } from "./Resource.js";
import { clearTabs, Tab } from "./Tab.js";
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
        if (!prompt || confirm("Are you sure that you want to erase all your progress?")) {
            Resource.Map = {};
            this.resources = [];
            this.focusPower = 1; // TODO: put in Stats or something
            clearResources();

            Creature.Map = {};
            this.creatures = [];
            clearCreatures();

            Upgrade.Map = {};
            this.upgrades = [];
            clearUpgrades();

            this.achievements = [];
            clearAchievements();

            this.tabs = [];
            clearTabs();

            clearNews();

            setAllSettings({"bgColor": "#E82B2B", "fps": 60, "saveTime": 5});

            this.createResources();
            this.createCreatures();
            this.createUpgrades();
            this.createAchievements();
            this.createTabs();

            this.news = new News();
        }
    }

    // TODO rethink naming
    createCreatures () {
        this.creatures.push(
            new Creature(
                {
                    internalName: "Weaseal",
                    displayNameSingular: "Weaseal",
                    displayNamePlural: "Weaseals",
                    flavorText: "It's got fur and also... blubber?  You don't want to touch this creature at all.",
                    cost: {
                        berries: 1,
                        wood: 5,
                    },
                    production: {
                        berries: 1,
                        wood: 0.2,
                    },
                    totalProduced: {
                        berries: 0,
                        wood: 0,
                    },
                    costScalingFunction:
                        function () {
                            this.cost["berries"] *= 1.15;
                        },
                    initialQuantity: 0,
                }
            )
        );
        this.creatures.push(
            new Creature(
                {
                    internalName: "Beaverine",
                    displayNameSingular: "Beaverine",
                    displayNamePlural: "Beaverines",
                    flavorText: "Sometimes makes dams.  Sometimes tears apart others' dams.  Absolutely terrifying.",
                    cost: {
                        berries: 100,
                        wood: 50,
                    },
                    production: {
                        berries: 10,
                        wood: 20,
                    },
                    totalProduced: {
                        berries: 0,
                        wood: 0,
                    },
                    costScalingFunction:
                        function () {
                            this.cost["wood"] *= 1.15;
                        },
                    initialQuantity: 0,
                }
            )
        );
        this.creatures.push(
            new Creature(
                {
                    internalName: "Buckaroo",
                    displayNameSingular: "Buckaroo",
                    displayNamePlural: "Buckaroos",
                    flavorText: "Jumpy and frantic but great at gathering, oh deer!",
                    cost: {
                        berries: 500,
                        wood: 120,
                        flowers: 1
                    },
                    production: {
                        berries: 100,
                        wood: 20,
                        flowers: 0.001
                    },
                    totalProduced: {
                        berries: 0,
                        wood: 0,
                        flowers: 0,
                    },
                    costScalingFunction:
                        function () {
                            this.cost["berries"] *= 1.15;
                            this.cost["wood"] *= 1.15;
                        },
                    initialQuantity: 0,
                }
            )
        );
        this.creatures.push(
            new Creature(
                {
                    internalName: "Ptrocanfer",
                    displayNameSingular: "Ptrocanfer",
                    displayNamePlural: "Ptrocanfers",
                    flavorText: "Ridiculously expensive!  But maybe worth it?",
                    cost: {
                        wood: 890000,
                        flowers: 50,
                    },
                    production: {
                        berries: 100000,
                        wood: 100000,
                        flowers: 10,
                    },
                    totalProduced: {
                        berries: 0,
                        wood: 0,
                        flowers: 0,
                    },
                    costScalingFunction:
                        function () {
                            this.cost["wood"] *= 1.15;
                            this.cost["flowers"] *= 1.15;
                        },
                    initialQuantity: 0,
                }
            )
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
                        for (const creature of this.creatures) {
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
                        return (this.creatures[1].quantity > 0);
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
                        for (const creature of this.creatures) {
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
                        for (const creature of this.creatures) {
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
                    id: "seal1",
                    displayName: "We'll seal you later!",
                    lockedFlavorText: "Hmm... maybe there's a creature with a name like that",
                    unlockedFlavorText: "In fact, we'll seal you now!",
                    unlockCondition: () => {
                        return (Creature.Map['Weaseal'].quantity >= 1);
                    },
                    effect: () => {},
                }
            )
        );
        this.achievements.push(
            new Achievement(
                {
                    id: "lilies1",
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
        )
    }

    createTabs () {
        this.tabs.push(
            new Tab(
                {
                    id: "creatureTab",
                    buttonText: "Creatures",
                    divToShow: document.getElementById("creatures"),
                    unlockCondition: function () {return true;},
                }
            )
        )
        this.tabs.push(
            new Tab(
                {
                    id: "upgradeTab",
                    buttonText: "Upgrades",
                    divToShow: document.getElementById("upgrades"),
                    unlockCondition: function () {return true;},
                }
            )
        )
        this.tabs.push(
            new Tab(
                {
                    id: "achievementTab",
                    buttonText: "Achievements",
                    divToShow: document.getElementById("achievements"),
                    unlockCondition: function () {return true;},
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

        for (const creature of this.creatures) {
            creature.tick(settings.fps);
        }
        for (const creature of this.creatures) {
            creature.updateDOM();
            // TODO: make sure separating tick() and updateDOM() is the right decision (like to make sure we're not constantly lagging a frame behind or something?)
            // TODO: actually I'm pretty sure that it's for resource tickAdd() and tickConsume()ing.  Then the todo becomes to make sure that all this is in the right order and comment to remind me of what's going on here
            // TODO: well then maybe put that in draw() below?
        }
        for (const upgrade of this.upgrades) {
            upgrade.tick();
            // TODO: as above, make sure that keeping updateDOM() inside tick() is the right course of action (counter to above)
            // TODO: that does not have much parity, to be honest
        }
        for (const achievement of this.achievements) {
            achievement.tick();
        }
        this.news.tick();

        this.draw();

        document.body.style.backgroundColor = settings.bgColor;

        // bind() to set the this var correctly.
        setTimeout(this.tick.bind(this), 1000 / settings.fps);
    }

    draw () {
        for (const resource of this.resources) {
            resource.draw();
        }

        for (const achievement of this.achievements) {
            achievement.draw();
        }
    }

    // TODO: modifiers to buy max or multiple, etc.; also visual indicator for such
    // TODO: figure out what to do if there's 10 or more creature types?
    handleKey (key) {
        if (key >= "1" && key <= this.creatures.length.toString()) {
            this.creatures[parseInt(key)-1].buy();
        }
    }

    // SAVING AND LOADING
    save () {
        // Get save string by concatenating all of the game state's save strings
        let save = "";

        save += this.resources.map(resource => resource.save()).join("|");
        save += "||" + Resource.focusedResource.internalName;
        save += "%%";
        save += this.creatures.map(creature => creature.save()).join("|");
        save += "%%";
        save += this.upgrades.map(upgrade => upgrade.save()).join("|");
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
        for (let i = 0; i<this.creatures.length; ++i) {
            this.creatures[i].load(creaturesSave[i]);
        }

        let upgradesSave = saveComponents[2].split("|");
        for (let i = 0; i<this.upgrades.length; ++i) {
            this.upgrades[i].load(upgradesSave[i]);
        }

        let settingsSave = saveComponents[3];
        loadSettings(settingsSave);
    }
}

export { Game };
