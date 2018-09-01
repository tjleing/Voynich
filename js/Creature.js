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

        this.constructDOM ();
    }

    constructDOM () {
        // create button on right panel
        const buttonDiv = document.createElement("div");
        const br1 = document.createElement("br");
        const br2 = document.createElement("br");

        this.button = document.createElement("button")
        this.button.id = `button${this.id}`;
        this.button.classList.add("button");
        this.button.classList.add("tooltip");

        this.nameSpan = document.createElement("span");
        this.quantitySpan = document.createElement("span");
        this.costSpan = document.createElement("span");
        this.tooltipSpan = document.createElement("span");

        this.nameSpan.classList.add("creatureName");
        this.quantitySpan.classList.add("creatureQuantity");
        this.costSpan.classList.add("creatureCost");
        this.tooltipSpan.classList.add("tooltipText");

        this.button.appendChild(this.nameSpan);
        this.button.appendChild(br1);
        this.button.appendChild(this.quantitySpan);
        this.button.appendChild(br2);
        this.button.appendChild(this.costSpan);
        this.button.appendChild(this.tooltipSpan);

        this.button.addEventListener("click", this.buy.bind(this), false);

        buttonDiv.appendChild(this.button);
        buttonDiv.id = `${this.id}`;
        const creatureDiv = document.getElementById("creatures");
        creatureDiv.appendChild(buttonDiv);
    }

    updateDOM () {
        this.nameSpan.innerHTML = `${this.nameSingular}`;
        this.quantitySpan.innerHTML = `You have ${this.quantity}`;
        this.costSpan.innerHTML = '';
        for (var i = 0; i < Object.keys(this.cost).length; ++i) {
            const resourceName = Object.keys(this.cost)[i];
            const resource = Resource.Map[resourceName];
            let affordableClass = "";
            if (this.cost[resourceName] > Resource.Map[resourceName].amount) {
                affordableClass = "creatureCostUnaffordable";
            }
            else {
                affordableClass = "creatureCostAffordable";
            }
            this.costSpan.innerHTML += `<span class=${affordableClass}>${resource.displayNamePlural}: ${this.cost[resourceName]}</span><br>`;
        }
        this.tooltipSpan.innerHTML = `You currently have NOTHING`;
    }

    tick(fps) {
        var affordable = true;
        for (var key in this.cost) {
            if (this.cost.hasOwnProperty(key)) {
                if (this.cost[key] > Resource.Map[key].amount) {
                    affordable = false;
                }
            }
        }

        for (var key in this.production) {
            if (this.cost.hasOwnProperty(key)) {
                Resource.Map[key].amount += this.production[key] * this.quantity / fps;
            }
        }

        if (affordable) {
            this.button.classList.toggle("grayed", false);
            this.button.classList.toggle("notgrayed", true);
        }
        else {
            this.button.classList.toggle("notgrayed", false);
            this.button.classList.toggle("grayed", true);
        }

        this.updateDOM();
    }

    buy() {
        var affordable = true;
        for (var key in this.cost) {
            if (this.cost.hasOwnProperty(key)) {
                if (this.cost[key] > Resource.Map[key].amount) {
                    affordable = false;
                }
            }
        }

        // No buy on click even if greyed out
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
