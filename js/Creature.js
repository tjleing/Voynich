// @ts-check

import { Resource } from "./Resource.js";
import { settings } from "./Settings.js";
import { deepFix, fix, maximumTimeToGet } from "./Utils.js";

class Creature {
    constructor(
        nameSingular,
        namePlural,
        cost,
        production,
        totalProduced,
        costScalingFunction,
        flavorText,
        initialQuantity
    ) {
        this._id = Creature.counter;

        this.nameSingular = nameSingular;
        this.namePlural = namePlural;
        this.cost = cost;
        this.production = production;
        this.totalProduced = totalProduced;
        this.costScalingFunction = costScalingFunction;
        this.flavorText = flavorText;
        this.quantity = initialQuantity; // TODO: don't put this here; just in save-load?  at the very least don't pass through constructor, just set to 0s based on production (might make it hard for a creature to produce new resources? [can pass in a 0 for that in production, and then special-case it in tooltip??])
        this.affordable = false;

        this.constructDOM();
    }

    constructDOM () {
        // create button on right panel
        const buttonDiv = document.createElement("div");
        const br1 = document.createElement("br");
        const br2 = document.createElement("br");

        this.button = document.createElement("button");
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
        const newNameSpan = `${this.nameSingular}`;
        if (this.nameSpan.textContent !== newNameSpan) {
            this.nameSpan.textContent = newNameSpan;
        }
        const newQuantitySpan = `You have ${this.quantity}`;
        if (this.quantitySpan.textContent !== newQuantitySpan) {
            this.quantitySpan.textContent = newQuantitySpan;
        }
        let newCostSpanHTML = "";
        for (const resourceName of Object.keys(this.cost)) {
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

        let resourcesPerSecondString = "";
        for (const resourceName of Object.keys(this.production)) {
            const resourcePerSecondPerOneCreature = this.production[resourceName];
            // Round to one decimal point (since we have some creatures that produce 0.2/sec)
            const resourcePerSecond = fix(resourcePerSecondPerOneCreature * this.quantity * 10) / 10;
            resourcesPerSecondString += `<br/>+${resourcePerSecond} ${resourceName}/sec`;
        }
        let totalResourcesProducedString = "";
        for (const resourceName of Object.keys(this.totalProduced)) {
            totalResourcesProducedString += `<br/>+${fix(this.totalProduced[resourceName])} ${resourceName} all time`;
        }
        let timeUntilAffordableString = "";
        if (!this.affordable) {
            // TODO: two maps? gross
            const timeUntilAffordable = maximumTimeToGet(
                Object.keys(this.cost).map((resourceName) =>
                    this.cost[resourceName]-Resource.Map[resourceName].amount
                ),
                Object.keys(this.cost).map((resourceName) =>
                    Resource.Map[resourceName].amountPerTick * settings.fps
                )
            );
            timeUntilAffordableString = `<br/><br/>Time until affordable: ${timeUntilAffordable}`;
        }
        const newTooltipSpanHTML = `${this.flavorText}<br/><br/>Currently:${resourcesPerSecondString}<br/>${totalResourcesProducedString}${timeUntilAffordableString}`;
        if (this.tooltipSpan.innerHTML !== newTooltipSpanHTML) {
            this.tooltipSpan.innerHTML = newTooltipSpanHTML;
        }
    }

    setAffordable() {
        this.affordable = true;
        for (const resourceName of Object.keys(this.cost)) {
            if (this.cost[resourceName] > Resource.Map[resourceName].amount) {
                this.affordable = false;
            }
        }
    }

    tick() {
        for (const resourceName of Object.keys(this.production)) {
            const amountProduced = this.production[resourceName] * this.quantity / settings.fps;
            Resource.Map[resourceName].tickAdd(amountProduced);
            this.totalProduced[resourceName] += amountProduced;
        }

        this.setAffordable();
        if (this.affordable) {
            this.button.classList.toggle("grayed", false);
            this.button.classList.toggle("notgrayed", true);
        }
        else {
            this.button.classList.toggle("notgrayed", false);
            this.button.classList.toggle("grayed", true);
        }
    }

    buy () {
        this.setAffordable();
        if (!this.affordable) {
            return;
        }

        for (var key in this.cost) {
            if (this.cost.hasOwnProperty(key)) {
                Resource.Map[key].noTickConsume(this.cost[key]);
            }
        }

        this.quantity++;
        this.costScalingFunction();
    }

    // Saving and loading
    load (saveString) {
        let saveComponents = saveString.split("$");
        this.cost = JSON.parse(saveComponents[0]); // JSON stores types, so need to parse values back to ints
        this.totalProduced = JSON.parse(saveComponents[1]);
        this.quantity = parseInt(saveComponents[2]);
    }

    save () {
        let saveComponents = [];
        saveComponents.push(JSON.stringify(deepFix(this.cost)));
        saveComponents.push(JSON.stringify(deepFix(this.totalProduced)));
        saveComponents.push(this.quantity);

        return saveComponents.join("$");
    }


    static get counter () {
        return Creature._counter++;
    }

    get id () {
        return this._id;
    }
}

function clearCreatures () {
    Creature._counter = 0;

    const creatureDiv = document.getElementById("creatures");
    creatureDiv.innerHTML = "";
}

export { clearCreatures, Creature };
