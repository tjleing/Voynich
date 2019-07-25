// @ts-check

import { fix } from "./Utils.js";
import { settings } from "./Settings.js";

class PrestigeResource {
    constructor ({
        internalName,
        displayNameSingular,
        displayNamePlural,
        flavorText,
        startingAmount,
        calculateNewAmount,
        active
    }) {
        this.internalName = internalName;
        this.displayNameSingular = displayNameSingular;
        this.displayNamePlural = displayNamePlural;
        this.flavorText = flavorText;
        // TODO: amount vs. quantity
        this.amount = startingAmount;
        this.calculateNewAmount = calculateNewAmount;
        this.amountPerTick = 0;
        this.isFocused = false;
        this.active = active;

        PrestigeResource.Map[internalName] = this;

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
        this.amountDiv.classList.add("tooltip");
        this.amountSpan = document.createElement("span");
        this.amountDiv.appendChild(this.amountSpan);

        this.tooltipSpan = document.createElement("span");
        this.tooltipSpan.classList.add("tooltipText");

        this.amountDiv.appendChild(this.tooltipSpan);

        const prestigeResourceAmounts = document.getElementById("prestigeResourceAmounts");
        prestigeResourceAmounts.appendChild(this.amountDiv);
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
        const amountGainedOnPrestige = fix(this.calculateNewAmount());

        const newTooltipSpanHTML = `${this.flavorText}<br><br>Currently: +${amountGainedOnPrestige} upon 'another one'<hr>`;
        if (this.tooltipSpan.innerHTML !== newTooltipSpanHTML) {
            this.tooltipSpan.innerHTML = newTooltipSpanHTML;
        }

        this.amountSpan.textContent = `${fixedAmount} ${nameToUse} (+${amountGainedOnPrestige} upon 'another one')`;

        // UI change if current resource is focused
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

function clearPrestigeResources () {
    const prestigeResourceAmounts = document.getElementById("prestigeResourceAmounts");
    prestigeResourceAmounts.innerHTML = "";
}

export { clearPrestigeResources, PrestigeResource };
