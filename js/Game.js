// @ts-check

import { clearAchievements } from "./Achievement.js";
import { createAchievements } from "./configs/AchievementConfigs.js";
import { loadSettings, saveSettings, settings, setAllSettings } from "./Settings.js";
import { notify } from "./Utils.js";
import { stats } from "./Stats.js";
import { createAscension, loadAscension } from "./Ascension.js";
import { baseAscensions } from "./configs/AscensionConfigs.js";

class Game {
    constructor () {
        this.prep();
    }

    prep () {
        this.ascensions = [];

        // TODO: figure out why these need to be in both prep() and hardReset()
        this.achievements = createAchievements(this);

        // TODO: move to own function
        document.getElementById("hardReset").onclick = this.hardReset.bind(this, true);
        document.getElementById("export").onclick = this.exportSave.bind(this);
        document.getElementById("import").onclick = this.importSave.bind(this);
    }

    hardReset (prompt) {
        if (!prompt || confirm("Are you sure that you want to erase all your progress?")) {
            this.focusPower = 1; // TODO: put in World constructor or something

            document.getElementById("worldLevel").innerHTML = "";
            // TODO: will need to fix this when I add the ascension level stuff
            document.getElementById("ascensionResources").innerHTML = "";

            this.ascensions = [];
            for (const ascensionName of baseAscensions) {
                const ascension = createAscension(ascensionName);
                this.ascensions.push(ascension);
            }

            this.achievements = [];
            clearAchievements();
            this.achievements = createAchievements(this);

            setAllSettings({"bgColor": "#E82B2B", "fps": 20, "saveTime": 20});

            // Needs to be after creating the worlds
            stats.initialize(this);
        }
    }

    tick () {
        for (const ascension of this.ascensions) {
            ascension.tick();
        }
        
        for (const achievement of this.achievements) {
            achievement.tick();
        }

        this.draw();

        // bind() to set the this var correctly.
        this.tickTimeout = setTimeout(this.tick.bind(this), 1000 / settings.fps);
    }

    draw () {
        for (const ascension of this.ascensions) {
            ascension.draw();
        }

        for (const achievement of this.achievements) {
            achievement.draw();
        }

        document.body.style.backgroundColor = settings.bgColor;
        stats.draw();
    }

    // TODO: modifiers to buy max or multiple, etc.; also visual indicator for such
    // TODO: figure out what to do if there's 10 or more creature types?
    handleKey (key) {
        this.ascensions[0].handleKey(key);
    }

    // SAVING AND LOADING
    save () {
        let save = {};

        // Terse map key names to save space in localStorage
        // TODO: make acheivements a singleton thing like settings?
        save["a"] = this.achievements.map(achievement => achievement.save());
        save["as"] = this.ascensions.map(ascension => ascension.save());
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

        document.getElementById("worldLevel").innerHTML = "";

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
        const ascensionsSave = save.as;
        this.ascensions = [];
        for (const ascensionSave of ascensionsSave) {
            const ascension = loadAscension(ascensionSave);
            this.ascensions.push(ascension);
        }

        const achievementsSave = save.a;
        for (let i = 0; i<this.achievements.length; ++i) {
            this.achievements[i].load(achievementsSave[i]);
        }

        const settingsSave = save.s;
        loadSettings(settingsSave);

        const statsSave = save.st;
        stats.initialize(this);
        stats.load(statsSave);
    }
}

export { Game };
