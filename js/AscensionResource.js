// @ts-check

import { deepCopy, fix } from "./Utils.js";
import { ascensionResourceConfigs } from "./configs/ResourceConfigs.js";
import { Resource } from "./Resource.js";

class AscensionResource extends Resource {
    constructor (args) {
        super(args);

        // gross unpacking (not in argument list) because we need to call to super
        let {
            internalName,
            displayNameSingular,
            displayNamePlural,
            flavorText,
            calculateGain,
            active
        } = args;

        this.internalName = internalName;
        this.displayNameSingular = displayNameSingular;
        this.displayNamePlural = displayNamePlural;
        this.flavorText = flavorText;
        this.calculateGain = calculateGain;
        this.isFocused = false;
        this.active = active;

        this.toGain = 0;
        this.ascension = this.container;
    }

    constructDOM () {
        this.constructAscensionDOM();
        this.constructWorldDOM();
    }

    constructAscensionDOM () {
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
        this.resourceDiv.appendChild(this.amountDiv);
    }

    constructWorldDOM () {
        if (this.gainDiv) {
            // Already constructed the HTML.
            return;
        }
        this.gainDiv = document.createElement("div");
        this.gainDiv.classList.add("tooltip");
        this.gainSpan = document.createElement("span");
        this.gainDiv.appendChild(this.gainSpan);

        this.gainTooltipSpan = document.createElement("span");
        this.gainTooltipSpan.classList.add("tooltipText");

        this.gainDiv.appendChild(this.gainTooltipSpan);
        document.getElementById("worldAscension");
        this.container.worldAscensionResourcesDiv.appendChild(this.gainDiv);
    }

    save () {
        const sv = super.save();
        sv.am = this.amount;
        return sv;
    }

    draw () {
        if (!this.active) {
            if (this.amount > 0) {
                this.active = true;
                this.constructDOM();
            }
            else {
                return;
            }
        }

        const fixedAmount = fix(this.amount);
        const nameToUse = fixedAmount === 1 ? this.displayNameSingular : this.displayNamePlural;

        const plus = this.toGain >= 0 ? "+" : ""; // + if gain positive, nothing if negative (it'll have its own negative)
        const newTooltipSpanHTML = `<span class="tooltipTextInner">${this.flavorText}<br><br>Currently: ${plus}${this.toGain} on A1<hr></span>`;
        if (this.gainTooltipSpan.innerHTML !== newTooltipSpanHTML) {
            this.gainTooltipSpan.innerHTML = newTooltipSpanHTML;
        }

        this.gainSpan.textContent = `${fixedAmount} ${nameToUse} (${plus}${this.toGain} on A1)`;
    }

    // TODO: eventually we might want to get tickadd and tickconsume back
    tick () {
        this.toGain = this.calculateGain(this.container);
    }
}

function createAscensionResource (name, resourceDiv, ascension) {
    return new AscensionResource({ ...deepCopy(ascensionResourceConfigs[name]), resourceDiv: resourceDiv, container: ascension });
}

function loadAscensionResource (save, resourceDiv, ascension) {
    const config = deepCopy(ascensionResourceConfigs[save.n]);
    config.amount = save.am;
    config.active = save.ac === 1 ? true : false;
    config.resourceDiv = resourceDiv;
    config.container = ascension;

    return new AscensionResource(config);
}

function clearAscensionResources () {
    const ascensionDiv = document.getElementById("ascensionResources");
    ascensionDiv.innerHTML = "";
}

export { createAscensionResource, loadAscensionResource, clearAscensionResources };
