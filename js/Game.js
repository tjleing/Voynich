// @ts-check

import { Creature } from "./Creature.js"
import { Upgrade } from "./Upgrade.js"
import { fix } from "./Utils.js"

class Game {
    constructor() {
        this.words = 0;
        this.words_per_click = 1;
        this.wps = 0;
        this.creatures = [];
        this.fps = 60;
    }

    click() {
        this.words += this.words_per_click;
    }

    hireCreature(i) {
        if(this.words >= this.creatures[i].cost) {
            this.words -= this.creatures[i].cost;
            this.creatures[i].buy();
        }
    }

    //TODO rethink naming
    createCreatures() {
        this.creatures.push(new Creature("Weaseal", 1, 10, 0));
        this.creatures.push(new Creature("Beaverine", 100, 100, 0));
    }

    loop() {
        const words_before = this.words;
        for (var i = 0; i < this.creatures.length; ++i) {
            const currentCreature = this.creatures[i];
            this.words += currentCreature.wps * currentCreature.quantity / this.fps;

            if (this.words >= currentCreature.cost) {
                currentCreature.affordable = true;
            }
            else {
                currentCreature.affordable = false;
            }

            currentCreature.tick();
        }
        const deltawords = this.words - words_before;
        this.wps = deltawords * this.fps;
        this.draw();

        // bind() to set the this var correctly.
        setTimeout(this.loop.bind(this), 1000 / this.fps);
    }

    draw() {
        var wordsDOM = document.getElementById("words");
        wordsDOM.innerHTML = fix(this.words) + " word" + (fix(this.words) == 1 ? "" : "s");
        var wpsDOM = document.getElementById("wordsps");
        wpsDOM.innerHTML = fix(this.wps) + " word" + (fix(this.wps) == 1 ? "" : "s") + " per second";
    }
}

export { Game };
