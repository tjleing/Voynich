// @ts-check

import { settings } from "./Settings.js";
import { deepFix, fix, maximumTimeToGet } from "./Utils.js";

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
            initialQuantity,
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
        this.quantity = initialQuantity; // TODO: don't put this here; just in save-load?  at the very least don't pass through constructor, just set to 0s based on production (might make it hard for a creature to produce new resources? [can pass in a 0 for that in production, and then special-case it in tooltip??])
        this.creatureDiv = creatureDiv;
        this.world = world;

        this.affordable = false;

        this.constructDOM();
    }

    constructDOM () {
        // create button on right panel
        const buttonDiv = document.createElement("div");
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

        buttonDiv.addEventListener("mouseup", this.buy.bind(this), false);
        buttonDiv.appendChild(this.button);
        this.creatureDiv.appendChild(buttonDiv);
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
        for (const resourceName of Object.keys(this.production)) {
            const resourcePerSecondPerOneCreature = this.production[resourceName];
            // Round to one decimal point (since we have some creatures that produce 0.2/sec)
            const resourcePerSecond = fix(resourcePerSecondPerOneCreature * this.quantity * 100) / 100;
            resourcesPerSecondString += `<br/>+${resourcePerSecond} ${resourceName}/sec`;
        }
        let totalResourcesProducedString = "";
        for (const resourceName of Object.keys(this.totalProduced)) {
            totalResourcesProducedString += `<br/>+${fix(this.totalProduced[resourceName])} ${resourceName} all time`;
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
        const newTooltipSpanHTML = `${this.flavorText}<br/><br/>Currently:${resourcesPerSecondString}<br/>${totalResourcesProducedString}${timeUntilAffordableString}`;
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
        for (const resourceName of Object.keys(this.production)) {
            const amountProduced = this.production[resourceName] * this.quantity / settings.fps;
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
                this.world.resources[key].noTickConsume(this.cost[key]);
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


const creatureConfigs = {
    "weaseal": {
        internalName: "Weaseal",
        displayNameSingular: "Weaseal",
        displayNamePlural: "Weaseals",
        flavorText: "It's got fur and also... blubber?  You don't want to touch this creature at all.",
        cost: {
            berries: 1,
            wood: 5,
        },
        production: {
            berries: 1,
            wood: 0.2,
        },
        totalProduced: {
            berries: 0,
            wood: 0,
        },
        costScalingFunction:
            function () {
                this.cost["berries"] *= 1.15;
            },
        initialQuantity: 0,
    },
    "beaverine": {
        internalName: "Beaverine",
        displayNameSingular: "Beaverine",
        displayNamePlural: "Beaverines",
        flavorText: "Sometimes makes dams.  Sometimes tears apart others' dams.  Absolutely terrifying.",
        cost: {
            berries: 100,
            wood: 50,
        },
        production: {
            berries: 10,
            wood: 20,
        },
        totalProduced: {
            berries: 0,
            wood: 0,
        },
        costScalingFunction:
            function () {
                this.cost["wood"] *= 1.15;
            },
        initialQuantity: 0,
    },
    "buckaroo": {
        internalName: "Buckaroo",
        displayNameSingular: "Buckaroo",
        displayNamePlural: "Buckaroos",
        flavorText: "Jumpy and frantic but great at gathering, oh deer!",
        cost: {
            berries: 500,
            wood: 120,
            flowers: 1
        },
        production: {
            berries: 100,
            wood: 20,
            flowers: 0.001
        },
        totalProduced: {
            berries: 0,
            wood: 0,
            flowers: 0,
        },
        costScalingFunction:
            function () {
                this.cost["berries"] *= 1.15;
                this.cost["wood"] *= 1.15;
            },
        initialQuantity: 0,
    },
    "ptrocanfer": {
        internalName: "Ptrocanfer",
        displayNameSingular: "Ptrocanfer",
        displayNamePlural: "Ptrocanfers",
        flavorText: "Ridiculously expensive!  But maybe worth it?",
        cost: {
            wood: 890000,
            flowers: 50,
        },
        production: {
            berries: 100000,
            wood: 100000,
            flowers: 10,
        },
        totalProduced: {
            berries: 0,
            wood: 0,
            flowers: 0,
        },
        costScalingFunction:
            function () {
                this.cost["wood"] *= 1.15;
                this.cost["flowers"] *= 1.15;
            },
        initialQuantity: 0,
    },
};

function createCreature (name, creatureDiv, world) {
    return new Creature({ ...creatureConfigs[name], creatureDiv: creatureDiv, world: world });
}

function loadCreature (save, creatureDiv, world) {
    const config = creatureConfigs[save.n];
    config.totalProduced = save.tp;
    config.quantity = save.q;
    config.creatureDiv = creatureDiv;
    config.world = world;

    const creature = new Creature(config);

    for (var i = 1; i < config.quantity; ++i) {
        creature.costScalingFunction();
    }

    return creature;
}

export { createCreature };
