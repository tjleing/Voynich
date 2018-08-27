// @ts-check

import { Creature } from "./Creature.js"
import { Upgrade } from "./Upgrade.js"
import { Resource } from "./Resource.js"
import { fix } from "./Utils.js"

class Game {
    constructor() {
        this.resources = [];

        this.words = 0;
        this.wordsPerClick = 1;
        this.wps = 0;
        this.creatures = [];
        this.upgrades = [];
        this.resources = [];
        this.fps = 60;
    }

    click() {
        this.words += this.wordsPerClick;
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
                true
            )
        );
        this.resources.push(
            new Resource(
                'wood',
                'Branch of Mahogany',
                'Branches of Mahogany',
                true
            )
        );
    }

    loop() {
        const wordsBefore = this.words;
        for (var i = 0; i < this.creatures.length; ++i) {
            const currentCreature = this.creatures[i];
            this.words += currentCreature.wps * currentCreature.quantity / this.fps;

            currentCreature.tick();
        }
        const deltawords = this.words - wordsBefore;
        this.wps = deltawords * this.fps;
        this.draw();

        // bind() to set the this var correctly.
        setTimeout(this.loop.bind(this), 1000 / this.fps);
    }

    draw() {
        const wordsDOM = document.getElementById("words");
        wordsDOM.innerHTML = fix(this.words) + " word" + (fix(this.words) == 1 ? "" : "s");
        const wpsDOM = document.getElementById("wordsps");
        wpsDOM.innerHTML = fix(this.wps) + " word" + (fix(this.wps) == 1 ? "" : "s") + " per second";
    }
}

export { Game };
