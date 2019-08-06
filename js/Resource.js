// @ts-check

import { fix } from "./Utils.js";
import { settings } from "./Settings.js";

class Resource {
    constructor ({
        internalName,
        displayNameSingular,
        displayNamePlural,
        flavorText,
        startingAmount,
        hitpoints,
        active,
        resourceDiv,
        world,
    }) {
        this.internalName = internalName;
        this.displayNameSingular = displayNameSingular;
        this.displayNamePlural = displayNamePlural;
        this.flavorText = flavorText;
        // TODO: amount vs. quantity
        this.amount = startingAmount;
        this.amountPerTick = 0;
        this.hitpoints = hitpoints;
        this.isFocused = false;
        this.active = active;
        this.resourceDiv = resourceDiv;
        this.world = world;

        if (this.active) {
            this.constructHTML();
        }
    }

    constructHTML () {
        if (this.amountDiv) {
            // Already constructed the HTML.
            return;
        }
        this.amountDiv = document.createElement("div");
        this.amountDiv.onclick = () => {this.world.resources.setFocusedResource(this)};
        this.amountDiv.classList.add("tooltip");
        this.amountSpan = document.createElement("span");
        this.amountDiv.appendChild(this.amountSpan);

        this.tooltipSpan = document.createElement("span");
        this.tooltipSpan.classList.add("tooltipText");

        this.amountDiv.appendChild(this.tooltipSpan);

        this.resourceDiv.appendChild(this.amountDiv);
    }

    draw () {
        if (!this.active) {
            if (this.amount > 0) {
                this.active = true;
                this.constructHTML();
            }
            else {
                return;
            }
        }

        const fixedAmount = fix(this.amount);
        const nameToUse = fixedAmount === 1 ? this.displayNameSingular : this.displayNamePlural;
        const amountPerSecond = fix(this.amountPerTick * settings.fps * 10) / 10;

        const plus = amountPerSecond > 0 ? "+" : ""; // + if amountPerSecond positive, - if negative
        const newTooltipSpanHTML = `${this.flavorText}<br><br>Currently: ${plus}${amountPerSecond} per second<hr>`;
        if (this.tooltipSpan.innerHTML !== newTooltipSpanHTML) {
            this.tooltipSpan.innerHTML = newTooltipSpanHTML;
        }

        this.amountSpan.textContent = `${fixedAmount} ${nameToUse} (${plus}${amountPerSecond}/sec)`;

        // UI change if current resource is focused
        if (this.isFocused) {
            this.amountSpan.style.fontWeight = 'bold';
        }
        else {
            this.amountSpan.style.fontWeight = '';
        }
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

    tickFocus (amount) {
        this.tickAdd(amount / this.hitpoints);
    }

    // Saving and loading
    load (saveString) {
        let saveComponents = saveString.split("$");
        this.amount = parseInt(saveComponents[0]);
        this.active = saveComponents[1] === "1";

        if (this.active) {
            this.constructHTML();
        }
    }

    save () {
        let saveComponents = [];
        saveComponents.push(fix(this.amount));
        saveComponents.push(this.active ? "1" : "0");

        return saveComponents.join("$");
    }
}


const resourceConfigs = {
    "berries": {
        internalName: "berries",
        displayNameSingular: "Liquid Gold Berry",
        displayNamePlural: "Liquid Gold Berries",
        flavorText: "It's worth its weight in liquid gold berries.",
        startingAmount: 0,
        hitpoints: 20,
        active: true,
    },
    "wood": {
        internalName: "wood",
        displayNameSingular: "Branch of Mahogany",
        displayNamePlural: "Branches of Mahogany",
        flavorText: "You could carve a nice sculpture out of one of these.",
        startingAmount: 0,
        hitpoints: 20,
        active: true,
    },
    "flowers": {
        internalName: "flowers",
        displayNameSingular: "Meadow Lily",
        displayNamePlural: "Meadow Lilies",
        flavorText: "The rarest flower!",
        startingAmount: 0,
        hitpoints: 500,
        active: true,
    },
};

function createResource (name, resourceDiv, world) {
    return new Resource({ ...resourceConfigs[name], resourceDiv: resourceDiv, world: world });
}

export { createResource,  };
