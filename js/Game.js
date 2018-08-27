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
    }

    click() {
        for (var i = 0; i<this.resources.length; ++i) {
            this.resources[i].amount += 1;
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
                    berries: 5,
                    wood: 1,
                },
                function () {
                    this.cost['berries'] *= 2;
                },
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
                    berries: 50,
                    wood: 100,
                },
                function () {
                    this.cost['wood'] *= 2;
                },
                0,
            )
        );
    }

    // TODO rethink naming
    createUpgrades() {
        this.upgrades.push(
            new Upgrade(
                'Berries???',
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
                'berries',
                'Liquid Gold Berry',
                'Liquid Gold Berries',
                0,
                true
            )
        );
        this.resources.push(
            new Resource(
                'wood',
                'Branch of Mahogany',
                'Branches of Mahogany',
                0,
                true
            )
        );
    }

    loop() {
        for (var i = 0; i < this.creatures.length; ++i) {
            const currentCreature = this.creatures[i];
            currentCreature.tick(this.fps);
        }
        this.draw();

        // bind() to set the this var correctly.
        setTimeout(this.loop.bind(this), 1000 / this.fps);
    }

    draw() {
        for (var i = 0; i<this.resources.length; ++i) {
            this.resources[i].draw();
        }
    }
}

export { Game };
