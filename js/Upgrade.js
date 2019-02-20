// @ts-check

import { Resource } from "./Resource.js";
import { settings } from "./Settings.js";
import { fix, maximumTimeToGet } from "./Utils.js";

class Upgrade {
    constructor (
        internalName,
        displayName,
        flavorText,
        cost,
        effect,
        unlockCondition
      ) {
        this.internalName = internalName;
        this.displayName = displayName;
        this.flavorText = flavorText;
        this.cost = cost;
        this.effect = effect;
        this.unlockCondition = unlockCondition;

        this.unlocked = false;
        this.purchased = false;
        this.affordable = false;

        Upgrade.Map[internalName] = this;
    }

    constructDOM () {
        // create button on right panel
        this.buttonDiv = document.createElement("div");
        const br1 = document.createElement("br");

        this.button = document.createElement("button");
        this.button.id = `upgradeButton${this.id}`;
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
        this.buttonDiv.id = `upgrade${this.id}`;
        const upgradeDiv = document.getElementById("upgrades");
        upgradeDiv.appendChild(this.buttonDiv);
    }

    destroyDOM () {
        try {
            document.getElementById("upgrades").removeChild(this.buttonDiv);
        }
        catch (error) {
            // Already removed
        }
    }

    updateDOM () {
        // TODO: bake name and cost in constructDOM(), since it won't ever change from its original... unless glitch world?
        const newNameSpan = `${this.displayName}`;
        if (this.nameSpan.textContent !== newNameSpan) {
            this.nameSpan.textContent = newNameSpan;
        }
        let newCostSpanHTML = "";
        for (const resourceName of Object.keys(this.cost)) {
            const resource = Resource.Map[resourceName];
            let affordableClass = "";
            if (this.cost[resourceName] > Resource.Map[resourceName].amount) {
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
                    this.cost[resourceName]-Resource.Map[resourceName].amount
                ),
                Object.keys(this.cost).map((resourceName) =>
                    Resource.Map[resourceName].amountPerTick * settings.fps
                )
            );
            timeUntilAffordableString = `<br/><br/>Time until affordable: ${timeUntilAffordable}`;
        }
        const newTooltipSpanHTML = `${this.flavorText}${timeUntilAffordableString}`;
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

    tick () {
        if (this.purchased) {
            return;
        }
        this.setAffordable();
        if (this.unlocked) {
            if (!this.unlockCondition()) {
                this.unlocked = false;
                console.log("shucks!");
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
            this.updateDOM();
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
                    Resource.Map[key].noTickConsume(this.cost[key]);
                }
            }
            this.effect();
            this.purchased = true;
            this.destroyDOM();
        }
    }

    // Saving and loading
    load (saveString) {
        let saveComponents = saveString.split("$");
        this.purchased = saveComponents[0] === "true";
        if (this.purchased || !this.unlocked) {
            this.destroyDOM();
        }
        if (this.purchased) {
            this.effect();
        }
    }

    save () {
        let saveComponents = [];
        saveComponents.push(this.purchased);

        return saveComponents.join("$");
    }

    static get counter () {
        return Upgrade._counter++;
    }

    get id () {
        return this._id;
    }
}

// TODO: idk where this should go, but should do something when there are no upgrades to buy -- right now it looks weird if there's nothing to buy (c.f. cookie clicker?)

function clearUpgrades () {
    Upgrade._counter = 0;

    document.getElementById("upgrades").innerHTML = "";
}

export { clearUpgrades, Upgrade };
