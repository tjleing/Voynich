// @ts-check

import { Creature } from "./Creature.js"
import { Upgrade } from "./Upgrade.js"
import { Resource } from "./Resource.js"
import { fix } from "./Utils.js"

class Game {
    constructor() {
        this.resources = [];

        this.creatures = [];
        this.upgrades = [];
        this.resources = [];
        this.fps = 60;

        // create stat div on left panel
        this.statDiv = document.createElement("div");
        this.statDiv.id = this.id + "stats";
        var leftpanel = document.getElementById("leftpanel");
        leftpanel.appendChild(this.statDiv);
    }

    click() {
        for (const resource of this.resources) {
            resource.amount += 1;
        }
        this.upgrades[0].buy();
    }

    // TODO rethink naming
    createCreatures() {
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
    }

    // TODO rethink naming
    createUpgrades() {
        this.upgrades.push(
            new Upgrade(
                "Berries???",
                undefined,
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
    createResources() {
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

    loop() {
        for (const creature of this.creatures) {
            creature.tick(this.fps);
        }
        this.draw();

        // bind() to set the this var correctly.
        setTimeout(this.loop.bind(this), 1000 / this.fps);
    }

    draw() {
        for (const resource of this.resources) {
            resource.draw();
        }
    }
}

export { Game };
