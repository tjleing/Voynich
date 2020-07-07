// @ts-check

import { settings } from "./Settings.js";
import { deepCopy, fix, maximumTimeToGet } from "./Utils.js";
import { creatureConfigs } from "./configs/CreatureConfigs.js";

class Creature {
    constructor({
            internalName,
            displayNameSingular,
            displayNamePlural,
            flavorText,
            cost,
            production,
            totalProduced,
            costScalingFunction,
            quantity,
            creatureDiv,
            world,
    }) {
        this.internalName = internalName;
        this.displayNameSingular = displayNameSingular;
        this.displayNamePlural = displayNamePlural;
        this.flavorText = flavorText;
        this.cost = cost;
        this.production = production;
        this.totalProduced = totalProduced;
        this.costScalingFunction = costScalingFunction;
        this.quantity = quantity;
        this.creatureDiv = creatureDiv;
        this.world = world;

        this.affordable = false;

        this.constructDOM();
    }

    constructDOM () {
        // create button on right panel
        this.buttonDiv = document.createElement("div");
        const br1 = document.createElement("br");
        const br2 = document.createElement("br");

        this.button = document.createElement("button");
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

        // Don't add the event listener here because we want to use the wrapped one
        // in stats
        // TODO: probably decorator is a better option...
        //buttonDiv.addEventListener("mouseup", this.buy.bind(this), false);
        this.buttonDiv.appendChild(this.button);
        this.creatureDiv.appendChild(this.buttonDiv);
    }

    calculateResourcesPerTick () {
        // Determine limiting factor in production, if any (dry run)
        // TODO: either make sure that no two creatures consume same resource or do fancy logic or just settle for "first creature gets dibs"
        let productionFactor = 1; // Full production
        for (const resourceName of Object.keys(this.production)) {
            const amountProduced = this.production[resourceName] * this.quantity / settings.fps;
            if (amountProduced < 0) {
                // Consuming this resource
                productionFactor = Math.min(productionFactor, -1.0 * this.world.resources[resourceName].amount / amountProduced);
            }
        }

        // Actually calculate
        const rpt = {};
        for (const resourceName of Object.keys(this.production)) {
            // TODO: fix after ascension encapsulates worlds or whatever
            rpt[resourceName] = this.production[resourceName] * this.quantity / settings.fps * productionFactor * (this.world.ascension.calculateMultiplier());
        }

        return rpt;
    }

    draw () {
        const newNameSpan = `${this.displayNameSingular}`;
        if (this.nameSpan.textContent !== newNameSpan) {
            this.nameSpan.textContent = newNameSpan;
        }
        const newQuantitySpan = `You have ${this.quantity}`;
        if (this.quantitySpan.textContent !== newQuantitySpan) {
            this.quantitySpan.textContent = newQuantitySpan;
        }
        let newCostSpanHTML = "";
        for (const resourceName of Object.keys(this.cost)) {
            const resource = this.world.resources[resourceName];
            let affordableClass = "";
            if (this.cost[resourceName] > this.world.resources[resourceName].amount) {
                affordableClass = "costUnaffordable";
            }
            else {
                affordableClass = "costAffordable";
            }
            newCostSpanHTML += `<span class=${affordableClass}>${resource.displayNamePlural}: ${fix(10 * this.cost[resourceName]) / 10.}</span><br>`;
        }
        if (this.costSpan.innerHTML !== newCostSpanHTML) {
            this.costSpan.innerHTML = newCostSpanHTML;
        }

        let resourcesPerSecondString = "";
        const rpt = this.calculateResourcesPerTick();
        for (const resourceName of Object.keys(rpt)) {
            // Round to one decimal point (since we have some creatures that produce 0.2/sec)
            const resourcePerSecond = fix(rpt[resourceName] * settings.fps * 100) / 100;
            const plus = resourcePerSecond >= 0 ? "+" : ""; // + if amountPerSecond positive, nothing if negative (it'll have its own negative)
            resourcesPerSecondString += `<br/>${plus}${resourcePerSecond} ${resourceName}/sec`;
        }
        let totalResourcesProducedString = "";
        // TODO: use external names instead of internal names??  what the heck is going on in this code base srsly
        for (const resourceName of Object.keys(this.totalProduced)) {
            const plus = this.totalProduced[resourceName] >= 0 ? "+" : ""; // + if amountPerSecond positive, nothing if negative (it'll have its own negative)
            totalResourcesProducedString += `<br/>${plus}${fix(this.totalProduced[resourceName])} ${resourceName} all time`;
        }
        let timeUntilAffordableString = "";
        if (!this.affordable) {
            // TODO: two maps? gross -- at least maybe hide in Utils
            const timeUntilAffordable = maximumTimeToGet(
                Object.keys(this.cost).map((resourceName) =>
                    this.cost[resourceName]-this.world.resources[resourceName].amount
                ),
                Object.keys(this.cost).map((resourceName) =>
                    this.world.resources[resourceName].amountPerTick * settings.fps
                )
            );
            timeUntilAffordableString = `<br/><br/>Time until affordable: ${timeUntilAffordable}`;
        }
        const newTooltipSpanHTML = `<span class="tooltipTextInner">${this.flavorText}<br/><br/>Currently:${resourcesPerSecondString}<br/>${totalResourcesProducedString}${timeUntilAffordableString}</span>`;
        if (this.tooltipSpan.innerHTML !== newTooltipSpanHTML) {
            this.tooltipSpan.innerHTML = newTooltipSpanHTML;
        }
    }

    setAffordable () {
        this.affordable = true;
        for (const resourceName of Object.keys(this.cost)) {
            if (this.cost[resourceName] > this.world.resources[resourceName].amount) {
                this.affordable = false;
            }
        }
    }

    tick () {
        const rpt = this.calculateResourcesPerTick();
        for (const resourceName of Object.keys(rpt)) {
            const amountProduced = rpt[resourceName];
            this.world.resources[resourceName].tickAdd(amountProduced);
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
                this.world.resources[key].consume(this.cost[key]);
            }
        }

        this.quantity++;
        this.costScalingFunction();
    }

    // Saving (loading is at the bottom with create)
    save () {
        let save = {};
        save.n = this.internalName;
        save.tp = this.totalProduced;
        save.q = this.quantity;

        return save;
    }
}


function createCreature (name, creatureDiv, world) {
    return new Creature({ ...deepCopy(creatureConfigs[name]), creatureDiv: creatureDiv, world: world });
}

function loadCreature (save, creatureDiv, world) {
    const config = deepCopy(creatureConfigs[save.n]);
    config.totalProduced = save.tp;
    config.quantity = save.q;
    config.creatureDiv = creatureDiv;
    config.world = world;

    const creature = new Creature(config);

    for (var i = 1; i <= config.quantity; ++i) {
        creature.costScalingFunction();
    }

    return creature;
}

export { createCreature, loadCreature };
