// @ts-check

import { createWorld, loadWorld } from "./World.js";
import { baseWorlds } from "./configs/WorldConfigs.js";
import { clearPrestigeResources, PrestigeResource } from "./PrestigeResource.js";
import { clearAchievements, Achievement } from "./Achievement.js";
import { createAchievements } from "./configs/AchievementConfigs.js";
import { loadSettings, saveSettings, settings, setSetting, setAllSettings } from "./Settings.js";
import { TabSet } from "./TabSet.js";
import { fix, notify } from "./Utils.js";
import { stats } from "./Stats.js";

class Game {
    constructor () {
        this.prep();
    }

    prep () {
        this.worlds = [];
        document.getElementById("game").innerHTML = "";

        // TODO: figure out why these need to be in both prep() and hardReset()
        this.achievements = createAchievements(this);
        this.prestigeResources = [];
        this.createPrestige();

        // TODO: move to own function
        document.getElementById("hardReset").onclick = this.hardReset.bind(this, true);
        document.getElementById("export").onclick = this.exportSave.bind(this);
        document.getElementById("import").onclick = this.importSave.bind(this);
        document.getElementById("anotherOne").onclick = this.anotherOne.bind(this);
    }

    hardReset (prompt) {
        if (!prompt || confirm("Are you sure that you want to erase all your progress?")) {
            this.focusPower = 1; // TODO: put in World constructor or something

            document.getElementById("game").innerHTML = "";
            this.worlds = [];

            for (const worldName of baseWorlds) {
                this.worlds.push(createWorld(worldName));
            }

            this.createTopTabBar();

            this.achievements = [];
            clearAchievements();
            this.achievements = createAchievements(this);

            this.prestigeResources = [];
            clearPrestigeResources();

            setAllSettings({"bgColor": "#E82B2B", "fps": 20, "saveTime": 20});

            this.createPrestige();

            // Needs to be after creating the worlds
            stats.initialize(this);
        }
    }

    anotherOne () {
        // Add prestige resources
        for (const pResource of this.prestigeResources) {
            pResource.amount += pResource.calculateAmountGained();
        }

        // Show +0 okra on fadeout
        // TODO: more resetting involved in future...  another option is just to override calculateAmountGained() or something
        for (const world of this.worlds) {
            world.okraGain = 0;
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
        this.worlds = [];
        for (const worldName of baseWorlds) {
            this.worlds.push(createWorld(worldName));
        }

        // Both of these need to happen after the worlds have been created
        this.createTopTabBar();
        stats.startNewAsc();
    }

    // TODO: decide wtf is going on with prestige
    createPrestige () {
        this.prestigeResources.push(
            new PrestigeResource(
                {
                    internalName: "okra",
                    displayNameSingular: "Okra",
                    displayNamePlural: "Okra",
                    flavorText: "The perfect solution to the world's drought!",
                    startingAmount: 0,
                    calculateAmountGained: () => {
                        let okraGain = 0;
                        for (const world of this.worlds) {
                            okraGain += world.okraGain;
                        }
                        return okraGain;
                    },
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
                for (const pResource of this.prestigeResources) {
                    if (pResource.amount > 0) {
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
        this.tabs = new TabSet(tabInfo, document.getElementById("topBar"), 0, undefined);
    }

    tick () {
        for (const world of this.worlds) {
            world.tick();
        }
        
        for (const achievement of this.achievements) {
            achievement.tick();
        }

        this.tabs.tick();

        this.draw();

        // bind() to set the this var correctly.
        this.tickTimeout = setTimeout(this.tick.bind(this), 1000 / settings.fps);
    }

    draw () {
        for (const world of this.worlds) {
            world.draw();
        }

        for (const achievement of this.achievements) {
            achievement.draw();
        }
        
        for (const prestigeResource of this.prestigeResources) {
            prestigeResource.draw();
        }

        document.body.style.backgroundColor = settings.bgColor;
        stats.draw();
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

        this.softReset();
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
        let save = {};

        // Terse map key names to save space in localStorage
        save["w"] = this.worlds.map(world => world.save());
        save["a"] = this.achievements.map(achievement => achievement.save());
        save["p"] = this.prestigeResources.map(pResource => pResource.save());
        save["t"] = this.tabs.save();
        save["s"] = saveSettings();
        save["st"] = stats.save();

        // Save it to localStorage, base-64 encoded
        localStorage.setItem("save", btoa(JSON.stringify(save)));
    }

    load () {
        const save = localStorage.getItem("save");

        try {
            // TODO: save versioning -- if it's an old save, update it if possible
            this.loadSave(save);
        }
        catch (error) {
            // Invalid or missing save
            // Because this is called on startup, we need to just wipe the game
            console.log(error);
            this.hardReset();
        }
    }

    importSave () {
        this.save();

        // To restore back to if the new save is invalid
        const oldSave = localStorage.getItem("save");
        const newSave = prompt("Paste your save (your current save will be overwritten)!");

        document.getElementById("game").innerHTML = "";

        // Common exit case: user didn't mean to open the import box, don't flash at them
        if (newSave === null) {
            this.loadSave(oldSave);
            return;
        }

        // prompt() blurs and refocuses the page, which clears the Noty notifications
        // so that there's not an extra backlog waiting for a user after being
        // off the page for a long time.  Moreover, it seems that the blur and
        // refocus events are called a fair amount after the prompt is closed?
        // In any case, notifications sent at least 300 ms after the prompt is
        // closed will appear.
        const NOTY_REFOCUS_DELAY = 300;
        try {
            this.loadSave(newSave);
            setTimeout(function () { notify("Save loaded"); }, NOTY_REFOCUS_DELAY);
        }
        catch (error) {
            this.loadSave(oldSave);
            setTimeout(function () { notify("Invalid save"); }, NOTY_REFOCUS_DELAY);
        }
    }

    exportSave () {
        this.save();
        const save = localStorage.getItem("save");

        // Boilerplate clipboard code
        const saveTextArea = document.createElement("textarea");
        // Avoid scrolling!
        saveTextArea.style.top = "0";
        saveTextArea.style.left = "0";
        saveTextArea.style.position = "fixed";
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
        const worldsSave = save.w;
        this.worlds = [];
        for (const worldSave of worldsSave) {
            const world = loadWorld(worldSave);
            this.worlds.push(world);
        }

        const achievementsSave = save.a;
        for (let i = 0; i<this.achievements.length; ++i) {
            this.achievements[i].load(achievementsSave[i]);
        }

        const prestigeResourcesSave = save.p;
        for (let i = 0; i<this.prestigeResources.length; ++i) {
            this.prestigeResources[i].load(prestigeResourcesSave[i]);
        }

        // TODO: eliminate (i.e. only call in prep()?) and just load tabs
        this.createTopTabBar();
        const tabsSave = save.t;
        this.tabs.load(tabsSave);

        const settingsSave = save.s;
        loadSettings(settingsSave);

        const statsSave = save.st;
        stats.initialize(this);
        stats.load(statsSave);
    }
}

export { Game };
