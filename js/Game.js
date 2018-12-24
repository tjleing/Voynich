// @ts-check

import { Creature } from "./Creature.js";
import { Resource } from "./Resource.js";
import { loadSettings, saveSettings, settings, setSetting, setAllSettings } from "./Settings.js";
import { Upgrade } from "./Upgrade.js";
import { fix } from "./Utils.js";

class Game {
    constructor () {
        this.hardReset();

        // Create stat div on left panel
        this.statDiv = document.createElement("div");
        this.statDiv.id = this.id + "stats";
        var leftpanel = document.getElementById("leftpanel");
        leftpanel.appendChild(this.statDiv);
    }

    hardReset () {
        // TODO: attach to hard reset button (with confirmation dialog or something)
        Resource.Map = {};
        this.resources = [];

        Creature._counter = 0;
        this.creatures = [];

        this.upgrades = [];

        setAllSettings({"fps": 60});
    }

    click () {
        for (const resource of this.resources) {
            resource.amount += 1;
        }
        this.upgrades[0].buy();
    }

    // TODO rethink naming
    createCreatures () {
        this.creatures.push(
            new Creature(
                "Weaseal",
                "Weaseals",
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
                "It's got fur and also... blubber?  You don't want to touch this creature at all.",
                0,
            )
        );
        this.creatures.push(
            new Creature(
                "Beaverine",
                "Beaverines",
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
                "Sometimes makes dams.  Sometimes tears apart others' dams.  Absolutely terrifying.",
                0,
            )
        );
        this.creatures.push(
            new Creature(
                "Ptrocanfer",
                "Ptrocanfers",
                {
                    berries: 1000000000,
                    wood: 500000000,
                },
                {
                    berries: 100000000,
                    wood: 200000000,
                },
                {
                    berries: 0,
                    wood: 0,
                },
                function () {
                    this.cost["wood"] *= 1.15;
                    this.cost["berries"] *= 1.15;
                },
                "Ridiculously expensive!  But maybe worth it?",
                0,
            )
        );
    }

    // TODO rethink naming
    createUpgrades () {
        this.upgrades.push(
            new Upgrade(
                "Berries???",
                {},
                () => {
                    this.creatures[0].buy();
                },
                () => {return true;},
                true,
                true,
                false,
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
                0,
                true
            )
        );
        this.resources.push(
            new Resource(
                "wood",
                "Branch of Mahogany",
                "Branches of Mahogany",
                0,
                true
            )
        );
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
        }
        this.draw();

        // bind() to set the this var correctly.
        setTimeout(this.loop.bind(this), 1000 / settings.fps);
    }

    draw () {
        for (const resource of this.resources) {
            resource.draw();
        }
    }

    save () {
        new Noty({
            layout: 'bottomRight',
            progressBar: true,
            theme: 'sunset',
            timeout: 5000,
            type: 'success',
            text: 'Game saved',
        }).show();
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
        let save = localStorage.getItem("save");
        if (!save) {
            // There is no save file, just break out
            return;
        }
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
