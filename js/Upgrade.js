// @ts-check

import { settings } from "./Settings.js";
import { fix, maximumTimeToGet } from "./Utils.js";

class Upgrade {
    constructor ({
        internalName,
        displayName,
        flavorText,
        cost,
        purchased,
        effect,
        unlockCondition,
        container,
      }) {
        this.internalName = internalName;
        this.displayName = displayName;
        this.flavorText = flavorText;
        this.cost = cost;
        this.effect = effect.bind(this);
        this.unlockCondition = unlockCondition.bind(this);
        this.container = container;
        this.purchased = purchased;

        this.unlocked = false;
        this.affordable = false;
    }

    constructDOM () {
        // create button on right panel
        this.buttonDiv = document.createElement("div");
        const br1 = document.createElement("br");

        this.button = document.createElement("button");
        this.button.classList.add("button");
        this.button.classList.add("tooltip");

        // spans live inside the button
        this.nameSpan = document.createElement("span");
        this.costSpan = document.createElement("span");
        this.tooltipSpan = document.createElement("span");

        this.nameSpan.classList.add("upgradeName");
        this.costSpan.classList.add("upgradeCost");
        this.tooltipSpan.classList.add("tooltipText");

        this.button.appendChild(this.nameSpan);
        this.button.appendChild(br1);
        this.button.appendChild(this.costSpan);
        this.button.appendChild(this.tooltipSpan);

        this.buttonDiv.addEventListener("mouseup", this.buy.bind(this), false);
        this.buttonDiv.appendChild(this.button);
        const upgradeDiv = this.container.upgradeDiv;
        upgradeDiv.appendChild(this.buttonDiv);
    }

    destroyDOM () {
        try {
            this.container.upgradeDiv.removeChild(this.buttonDiv);
        }
        catch (error) {
            // Already removed
        }
    }

    draw () {
        if (!this.unlocked) return;

        // TODO: bake name and cost in constructDOM(), since it won't ever change from its original... unless glitch world?
        const newNameSpan = `${this.displayName}`;
        if (this.nameSpan.textContent !== newNameSpan) {
            this.nameSpan.textContent = newNameSpan;
        }
        let newCostSpanHTML = "";
        for (const resourceName of Object.keys(this.cost)) {
            const resource = this.container.resources[resourceName];
            let affordableClass = "";
            if (this.cost[resourceName] > this.container.resources[resourceName].amount) {
                affordableClass = "costUnaffordable";
            }
            else {
                affordableClass = "costAffordable";
            }
            newCostSpanHTML += `<span class=${affordableClass}>${resource.displayNamePlural}: ${fix(this.cost[resourceName])}</span><br>`;
        }
        if (this.costSpan.innerHTML !== newCostSpanHTML) {
            this.costSpan.innerHTML = newCostSpanHTML;
        }

        let timeUntilAffordableString = "";
        if (!this.affordable) {
            // TODO: two maps? gross -- at least maybe hide in Utils
            const timeUntilAffordable = maximumTimeToGet(
                Object.keys(this.cost).map((resourceName) =>
                    this.cost[resourceName]-this.container.resources[resourceName].amount
                ),
                Object.keys(this.cost).map((resourceName) =>
                    this.container.resources[resourceName].amountPerTick * settings.fps
                )
            );
            timeUntilAffordableString = `<br/><br/>Time until affordable: ${timeUntilAffordable}`;
        }
        const newTooltipSpanHTML = `<span class="tooltipTextInner">${this.flavorText}${timeUntilAffordableString}</span>`;
        if (this.tooltipSpan.innerHTML !== newTooltipSpanHTML) {
            this.tooltipSpan.innerHTML = newTooltipSpanHTML;
        }
    }

    setAffordable() {
        this.affordable = true;
        for (const resourceName of Object.keys(this.cost)) {
            if (this.cost[resourceName] > this.container.resources[resourceName].amount) {
                this.affordable = false;
            }
        }
    }

    tick () {
        if (this.purchased) {
            return;
        }
        this.setAffordable();
        if (this.unlocked) {
            if (!this.unlockCondition()) {
                this.unlocked = false;
                this.destroyDOM();
                return;
            }
            if (this.affordable) {
                this.button.classList.toggle("grayed", false);
                this.button.classList.toggle("notgrayed", true);
            }
            else {
                this.button.classList.toggle("notgrayed", false);
                this.button.classList.toggle("grayed", true);
            }
            return;
        }
        if (this.unlockCondition()) {
            this.constructDOM();
            this.unlocked = true;
        }
    }

    buy () {
        this.setAffordable();
        if (this.unlocked && this.affordable && !this.purchased) {
            for (var key in this.cost) {
                if (this.cost.hasOwnProperty(key)) {
                    this.container.resources[key].consume(this.cost[key]);
                }
            }
            this.effect();
            this.purchased = true;
            this.destroyDOM();
        }
    }

    // Saving (loading is at the bottom with createUpgrade)
    save () {
        const save = {};
        save.n = this.internalName;
        save.p = this.purchased ? 1 : 0;

        return save;
    }
}

export { Upgrade };