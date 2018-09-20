// @ts-check

import { fix } from "./Utils.js"
import { settings } from "./Settings.js"

class Resource {
    constructor (internalName,
                 displayNameSingular,
                 displayNamePlural,
                 startingAmount,
                 active) {
        this.internalName = internalName;
        this.displayNameSingular = displayNameSingular;
        this.displayNamePlural = displayNamePlural;
        this.amount = startingAmount;
        this.amountPerTick = 0;
        this.active = active;
        Resource.Map[internalName] = this;

        this.constructHTML();
    }

    constructHTML () {
        this.amountDiv = document.createElement("div");
        this.amountDiv.id = `${this.internalName}Amount`;

        const resourceAmounts = document.getElementById("resourceAmounts");
        resourceAmounts.appendChild(this.amountDiv);
    }

    draw () {
        const fixedAmount = fix(this.amount);
        const nameToUse = fixedAmount == 1 ? this.displayNameSingular : this.displayNamePlural;
        const amountPerSecond = fix(this.amountPerTick * settings.fps * 10) / 10;
        this.amountDiv.innerHTML = `${fixedAmount} ${nameToUse} (+${amountPerSecond}/sec)`;
    }


    // To keep track of the resource gain per tick (and consequently per second),
    // use startTick to zero out the gain, and then for adding or consuming the
    // resource, use tickAdd and tickConsume.  When buying (or other actions
    // that shouldn't be tracked in resource gain per second, like selling),
    // use noTickAdd and noTickConsume.
    startTick () {
        this.amountPerTick = 0;
    }

    tickAdd (amount) {
        this.amount += amount;
        this.amountPerTick += amount;
    }

    tickConsume (amount) {
        this.amount -= amount;
        this.amountPerTick -= amount;
    }

    noTickAdd (amount) {
        this.amount += amount;
    }

    noTickConsume (amount) {
        this.amount -= amount;
    }
}

Resource.Map = {};

export { Resource };