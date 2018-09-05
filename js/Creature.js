// @ts-check

import { Resource } from "./Resource.js"
import { fix } from "./Utils.js"

class Creature {
    constructor(
        nameSingular,
        namePlural,
        cost,
        production,
        costScalingFunction,
        flavorText,
        initialQuantity
    ) {
        this._id = Creature.counter;

        this.nameSingular = nameSingular;
        this.namePlural = namePlural;
        this.cost = cost;
        this.production = production;
        this.costScalingFunction = costScalingFunction;
        this.quantity = initialQuantity;
        this.flavorText = flavorText;

        this.constructDOM();
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

        // spans live inside the button
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

        buttonDiv.addEventListener("mouseup", this.buy.bind(this), false);

        buttonDiv.appendChild(this.button);
        buttonDiv.id = `${this.id}`;
        const creatureDiv = document.getElementById("creatures");
        creatureDiv.appendChild(buttonDiv);
    }

    updateDOM () {
        const newNameSpanHTML = `${this.nameSingular}`;
        if (this.nameSpan.innerHTML !== newNameSpanHTML) {
            this.nameSpan.innerHTML = newNameSpanHTML;
        }
        const newQuantitySpanHTML = `You have ${this.quantity}`;
        if (this.quantitySpan.innerHTML !== newQuantitySpanHTML) {
            this.quantitySpan.innerHTML = newQuantitySpanHTML;
        }
        let newCostSpanHTML = '';
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
            newCostSpanHTML += `<span class=${affordableClass}>${resource.displayNamePlural}: ${fix(this.cost[resourceName])}</span><br>`;
        }
        if (this.costSpan.innerHTML !== newCostSpanHTML) {
            this.costSpan.innerHTML = newCostSpanHTML;
        }

        const newTooltipSpanHTML = this.flavorText;
        if (this.tooltipSpan.innerHTML !== newTooltipSpanHTML) {
            this.tooltipSpan.innerHTML = newTooltipSpanHTML;
        }
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
