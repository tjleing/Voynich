// @ts-check

import { clearCreatures, Creature } from "./Creature.js";
import { clearNews, News } from "./News.js";
import { clearResources, Resource } from "./Resource.js";
import { clearTabs, Tab } from "./Tab.js";
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
            clearResources();

            Creature.Map = {};
            this.creatures = [];
            clearCreatures();

            Upgrade.Map = {};
            this.upgrades = [];
            clearUpgrades();

            this.tabs = [];
            clearTabs();

            clearNews();

            setAllSettings({"bgColor": "#E82B2B", "fps": 60, "saveTime": 5});

            this.createResources();
            this.createCreatures();
            this.createUpgrades();
            this.createTabs();

            this.news = new News();
        }
    }

    click () {
        for (const resource of this.resources) {
            if (resource.internalName === "flowers") {
                if (Math.random() <= 0.01) {
                    resource.amount += 1;
                }
            }
            else {
                resource.amount += 1;
            }
        }
    }

    // TODO rethink naming
    createCreatures () {
        this.creatures.push(
            new Creature(
                "Weaseal",
                "Weaseal",
                "Weaseals",
                "It's got fur and also... blubber?  You don't want to touch this creature at all.",
                {
                    berries: 1,
                    wood: 5,
                },
                {
                    berries: 1,
                    wood: 0.2,
                },
                {
                    berries: 0,
                    wood: 0,
                },
                function () {
                    this.cost["berries"] *= 1.15;
                },
                0,
            )
        );
        this.creatures.push(
            new Creature(
                "Beaverine",
                "Beaverine",
                "Beaverines",
                "Sometimes makes dams.  Sometimes tears apart others' dams.  Absolutely terrifying.",
                {
                    berries: 100,
                    wood: 50,
                },
                {
                    berries: 10,
                    wood: 20,
                },
                {
                    berries: 0,
                    wood: 0,
                },
                function () {
                    this.cost["wood"] *= 1.15;
                },
                0,
            )
        );
        this.creatures.push(
            new Creature(
                "Buckaroo",
                "Buckaroo",
                "Buckaroos",
                "Jumpy and frantic but great at gathering, oh deer!",
                {
                    berries: 500,
                    wood: 120,
                    flowers: 1
                },
                {
                    berries: 100,
                    wood: 20,
                    flowers: 0.001
                },
                {
                    berries: 0,
                    wood: 0,
                },
                function () {
                    this.cost["berries"] *= 1.15;
                    this.cost["wood"] *= 1.15;
                },
                0,
            )
        );
        this.creatures.push(
            new Creature(
                "Ptrocanfer",
                "Ptrocanfer",
                "Ptrocanfers",
                "Ridiculously expensive!  But maybe worth it?",

                {
                    wood: 890000,
                    flowers: 50,
                },
                {
                    berries: 100000,
                    wood: 100000,
                    flowers: 10,
                },
                {
                    berries: 0,
                    wood: 0,
                    flowers: 0,
                },
                function () {
                    this.cost["wood"] *= 1.15;
                    this.cost["flowers"] *= 1.15;
                },
                0,
            )
        );
    }

    // TODO rethink naming
    createUpgrades () {
        this.upgrades.push(
            new Upgrade(
                "twoForOne",
                "Two for one deal!",
                "Everything gets cheaper?",
                {
                    berries: 100,
                    wood: 100,
                },
                () => {
                    for (const creature of this.creatures) {
                        for (const resource of creature.cost) {
                            creature.cost[resource] *= 0.5;
                        }
                    }
                    for (const upgrade of this.upgrades) {
                        for (const resource of upgrade.cost) {
                            upgrade.cost[resource] *= 0.5;
                        }
                    }
                },
                () => {
                    return (this.resources[1].amount >= 10);
                },
            )
        );
        this.upgrades.push(
            new Upgrade(
                "BeaverineUp1",
                "Better dams",
                "Shucks, none of those ideas are good",
                {
                    berries: 1000,
                    wood: 1000,
                },
                () => {
                    this.creatures[1].production["wood"] *= 3;
                },
                () => {
                    var sum = 0;
                    for (const creature of this.creatures) {
                        sum += creature.quantity;
                    }
                    return (sum >= 10);
                },
            )
        );
        this.upgrades.push(
            new Upgrade(
                "everythingIsAwful",
                "Why would you do this?",
                "Makes everything do nothing",
                {
                    berries: 10,
                    wood: 10,
                },
                () => {
                    for (const creature of this.creatures) {
                        creature.production["wood"] *= 0.001;
                        creature.production["berries"] *= 0.001;
                    }
                },
                () => {
                    return (this.creatures[1].quantity > 0);
                },
            )
        );
        this.upgrades.push(
            new Upgrade(
                "undoAwful",
                "You shouldn't have done that",
                "Fixes your mistakes",
                {
                    berries: 100,
                    wood: 100,
                },
                () => {
                    for (const creature of this.creatures) {
                        creature.production["wood"] /= 0.001;
                        creature.production["berries"] /= 0.001;
                    }
                },
                () => {
                    return (this.upgrades[2].purchased);
                },
            )
        );
        this.upgrades.push(
            new Upgrade(
                "greyBG",
                "More depressing",
                "Yum! Makes the game more depressing",
                {
                    berries: 0,
                    wood: 0,
                    flowers: 0,
                },
                () => {
                    settings.bgColor = "#888888";
                },
                () => {
                    for (const creature of this.creatures) {
                        if (creature.quantity >= 13) return true;
                    }
                    return false;
                },
            )
        );
        this.upgrades.push(
            new Upgrade(
                "getPtroed",
                "Skip the whole game",
                "This one's on the hill!",
                {
                    flowers: 1,
                },
                () => {
                    this.creatures[3].quantity++;
                },
                () => {
                    for (const creature of this.creatures) {
                        if (creature.quantity > 0) return false;
                    }
                    return true;
                },
            )
        );
    }

    // TODO rethink naming
    createResources () {
        this.resources.push(
            new Resource(
                "berries",
                "Liquid Gold Berry",
                "Liquid Gold Berries",
                "It's worth its weight in liquid gold berries.",
                0,
                true
            )
        );
        this.resources.push(
            new Resource(
                "wood",
                "Branch of Mahogany",
                "Branches of Mahogany",
                "You could carve a nice sculpture out of one of these.",
                0,
                true
            )
        );
        this.resources.push(
            new Resource(
                "flowers",
                "Meadow Lily",
                "Meadow Lilies",
                "The rarest flower!",
                0,
                false
            )
        )
    }

    createTabs () {
        this.tabs.push(
            new Tab(
                "creatureTab",
                "Creatures",
                document.getElementById("creatures"),
                function () {return true;}
            )
        )
        this.tabs.push(
            new Tab(
                "upgradeTab",
                "Upgrades",
                document.getElementById("upgrades"),
                function () {return true;}
            )
        )

        this.tabs[0].setActive();
    }

    loop () {
        for (const resource of this.resources) {
            resource.startTick();
        }
        for (const creature of this.creatures) {
            creature.tick(settings.fps);
        }
        for (const creature of this.creatures) {
            creature.updateDOM();
            // TODO: make sure separating tick() and updateDOM() is the right decision (like to make sure we're not constantly lagging a frame behind or something?)
            // TODO: actually I'm pretty sure that it's for resource tickAdd() and tickConsume()ing.  Then the todo becomes to make sure that all this is in the right order and comment to remind me of what's going on here
        }
        for (const upgrade of this.upgrades) {
            upgrade.tick();
            // TODO: as above, make sure that keeping updateDOM() inside tick() is the right course of action (counter to above)
        }
        this.news.tick();

        this.draw();

        document.body.style.backgroundColor = settings.bgColor;

        // bind() to set the this var correctly.
        setTimeout(this.loop.bind(this), 1000 / settings.fps);
    }

    draw () {
        for (const resource of this.resources) {
            resource.draw();
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

        let resourcesSave = saveComponents[0].split("|");
        for (let i = 0; i<this.resources.length; ++i) {
            this.resources[i].load(resourcesSave[i]);
        }

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
