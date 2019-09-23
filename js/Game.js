// @ts-check

import { createWorld, loadWorld } from "./World.js";
import { clearPrestigeResources, PrestigeResource } from "./PrestigeResource.js";
import { clearAchievements, Achievement } from "./Achievement.js";
import { loadSettings, saveSettings, settings, setSetting, setAllSettings } from "./Settings.js";
import { TabSet } from "./TabSet.js";
import { fix, notify } from "./Utils.js";

class Game {
    constructor () {
        this.prep();
    }

    prep () {
        this.worlds = [];
        document.getElementById("game").innerHTML = "";

        // TODO: figure out why these need to be in both prep() and hardReset()
        this.achievements = [];
        this.createAchievements();
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
            this.worlds.push(createWorld("lush"));
            this.worlds.push(createWorld("wooded"));

            this.createTopTabBar();

            this.achievements = [];
            clearAchievements();

            this.prestigeResources = [];
            clearPrestigeResources();

            setAllSettings({"bgColor": "#E82B2B", "fps": 20, "saveTime": 20});

            this.createAchievements();
            this.createPrestige();
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
        this.worlds.push(createWorld("lush"));
        this.worlds.push(createWorld("wooded"));

        this.createTopTabBar();
    }

    // TODO: probably this function should just live in Achievement.js and return the list
    createAchievements () {
        this.achievements.push(
            new Achievement(
                {
                    displayName: "We'll seal you later!",
                    lockedFlavorText: "Hmm... maybe there's a creature with a name like that",
                    unlockedFlavorText: "In fact, we'll seal you now!",
                    unlockCondition: () => {
                        for (const world of this.worlds) {
                            if ("weaseal" in world.creatures && world.creatures.weaseal.quantity >= 1)
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
                            if ("flowers" in world.resources && world.resources.flowers.amount >= 1)
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
                            if (world.okraGain > 0)
                                return true;
                        }
                        return false;
                    },
                    effect: () => {},
                }
            )
        );
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
        for (const achievement of this.achievements) {
            achievement.draw();
        }
        
        for (const prestigeResource of this.prestigeResources) {
            prestigeResource.draw();
        }

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

        save["p"] = this.prestigeResources.map(pResource => pResource.save()).join("|");

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

        // Common exit case: user didn't mean to open the import box, don't flash at them
        if (newSave === null) {
            this.loadSave(oldSave);
            return;
        }

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

        let achievementsSave = save.a.split("|");
        for (let i = 0; i<this.achievements.length; ++i) {
            this.achievements[i].load(achievementsSave[i]);
        }

        let prestigeResourceSave = save.p.split("|");
        for (let i = 0; i<this.prestigeResources.length; ++i) {
            this.prestigeResources[i].load(prestigeResourceSave[i]);
        }

        let settingsSave = save.s;
        loadSettings(settingsSave);
    }
}

export { Game };
