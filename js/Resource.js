// @ts-check

import { fix } from "./Utils.js"

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
        this.amountDiv.innerHTML = `${fixedAmount} ${nameToUse}`;
    }
}

Resource.Map = {};

export { Resource };
