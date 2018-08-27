// @ts-check

import { Resource } from "./Resource.js"

class Creature {
    constructor(
        nameSingular,
        namePlural,
        cost,
        production,
        costScalingFunction,
        initialQuantity
    ) {
        this._id = Creature.counter;

        this.nameSingular = nameSingular;
        this.namePlural = namePlural;
        this.cost = cost;
        this.production = production;
        this.costScalingFunction = costScalingFunction;
        this.quantity = initialQuantity;

        this.constructHTML();
    }

    constructHTML() {
        // create stat div on left panel
        this.statDiv = document.createElement("div");
        this.statDiv.id = this.id + "stats";
        var leftpanel = document.getElementById("leftpanel");
        leftpanel.appendChild(this.statDiv);

        // create buttons on right panel
        const buttonDiv = document.createElement("div");
        this.button = document.createElement("button")
        this.button.id = `button${this.id}`;
        this.button.classList.add('button');
        this.button.innerHTML = `Buy one <span id="bname${this.id}">${this.nameSingular}</span>`;

        this.button.addEventListener("click", this.buy.bind(this), false);

        buttonDiv.appendChild(this.button);
        buttonDiv.id = `${this.id}`;
        var creatureDiv = document.getElementById("creatures");
        creatureDiv.appendChild(buttonDiv);
    }

    tick() {
        var affordable = true;
        for (var key in this.cost) {
            if (this.cost.hasOwnProperty(key)) {
                if (this.cost[key] > Resource.Map[key].amount) {
                    affordable = false;
                }
            }
        }

        if (affordable) {
            this.button.classList.toggle('grayed', false);
            this.button.classList.toggle('notgrayed', true);
        }
        else {
            this.button.classList.toggle('notgrayed', false);
            this.button.classList.toggle('grayed', true);
        }
    }

    buy() {
        var affordable = true;
        for (var key in this.cost) {
            if (this.cost.hasOwnProperty(key)) {
                if (this.cost[key] < Resource.Map[key].amount) {
                    affordable = false;
                }
            }
        }

        // Don't want players hacking the game to buy creatures that they can't
        // afford!  Although if they're hacking nothing's really safe anyway
        if (!affordable) {
            return;
        }

        for (var key in this.cost) {
            if (this.cost.hasOwnProperty(key)) {
                Resource.Map[key].amount -= this.cost[key];
            }
        }

        this.quantity++;
        this.costScalingFunction();
    }

    static get counter () {
        return Creature._counter++;
    }

    get id () {
        return this._id;
    }
}

Creature._counter = 0;

export { Creature };
