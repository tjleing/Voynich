// @ts-check

import { settings } from "./Settings.js";
import { deepCopy, fix, maximumTimeToGet } from "./Utils.js";

class Upgrade {
    constructor ({
        internalName,
        displayName,
        flavorText,
        cost,
        purchased,
        effect,
        unlockCondition,
        world,
      }) {
        this.internalName = internalName;
        this.displayName = displayName;
        this.flavorText = flavorText;
        this.cost = cost;
        this.effect = effect.bind(this);
        this.unlockCondition = unlockCondition.bind(this);
        this.world = world;
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
        const upgradeDiv = this.world.upgradeDiv;
        upgradeDiv.appendChild(this.buttonDiv);
    }

    destroyDOM () {
        try {
            this.world.upgradeDiv.removeChild(this.buttonDiv);
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
            const resource = this.world.resources[resourceName];
            let affordableClass = "";
            if (this.cost[resourceName] > this.world.resources[resourceName].amount) {
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
                    this.cost[resourceName]-this.world.resources[resourceName].amount
                ),
                Object.keys(this.cost).map((resourceName) =>
                    this.world.resources[resourceName].amountPerTick * settings.fps
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
            if (this.cost[resourceName] > this.world.resources[resourceName].amount) {
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
                    this.world.resources[key].noTickConsume(this.cost[key]);
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


const upgradeConfigs = {
    "twoForOne": {
        internalName: "twoForOne",
        displayName: "Two for one deal!",
        flavorText: "Everything gets cheaper?",
        cost: {
            berries: 100,
            wood: 100,
        },
        purchased: false,
        effect: function () {
            for (const creature of this.world.creatures.creatureList) {
                for (const resource in creature.cost) {
                    creature.cost[resource] *= 0.5;
                }
            }
            for (const upgrade of this.world.upgrades.upgradeList) {
                for (const resource in upgrade.cost) {
                    upgrade.cost[resource] *= 0.5;
                }
            }
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 10);
        },
    },
    "BeaverineUp1": {
        internalName: "BeaverineUp1",
        displayName: "Better dams",
        flavorText: "Shucks, none of those ideas are good",
        cost: {
            berries: 1000,
            wood: 1000,
        },
        purchased: false,
        effect: function () {
            this.world.creatures.beaverine.production["wood"] *= 3;
        },
        unlockCondition: function () {
            var sum = 0;
            for (const creature of this.world.creatures.creatureList) {
                sum += creature.quantity;
            }
            return (sum >= 10);
        },
    },
    "everythingIsAwful": {
        internalName: "everythingIsAwful",
        displayName: "Why would you do this?",
        flavorText: "Makes everything do nothing",
        cost: {
            berries: 10,
            wood: 10,
        },
        purchased: false,
        effect: function () {
            for (const creature of this.world.creatures.creatureList) {
                creature.production["wood"] *= 0.001;
                creature.production["berries"] *= 0.001;
            }
        },
        unlockCondition: function () {
            return (this.world.creatures.beaverine.quantity > 0);
        },
    },
    "undoAwful": {
        internalName: "undoAwful",
        displayName: "You shouldn't have done that",
        flavorText: "Fixes your mistakes",
        cost: {
            berries: 100,
            wood: 100,
        },
        purchased: false,
        effect: function () {
            for (const creature of this.world.creatures.creatureList) {
                creature.production["wood"] /= 0.001;
                creature.production["berries"] /= 0.001;
            }
        },
        unlockCondition: function () {
            return (this.world.upgrades["everythingIsAwful"].purchased);
        },
    },
    "greyBG": {
        internalName: "greyBG",
        displayName: "More depressing",
        flavorText: "Yum! Makes the game more depressing",
        cost: {
            berries: 0,
            wood: 0,
            flowers: 0,
        },
        purchased: false,
        effect: function () {
            settings.bgColor = "#888888";
        },
        unlockCondition: function () {
            for (const creature of this.world.creatures.creatureList) {
                if (creature.quantity >= 13) return true;
            }
            return false;
        },
    },
    "getPtroed": {
        internalName: "getPtroed",
        displayName: "Skip the whole game",
        flavorText: "This one's on the hill!",
        cost: {
            flowers: 1,
        },
        purchased: false,
        effect: function () {
            this.world.creatures.ptrocanfer.quantity++;
        },
        unlockCondition: function () {
            for (const creature of this.world.creatures.creatureList) {
                if (creature.quantity > 0) return false;
            }
            return true;
        },
    },
    "doubleFocusPower": {
        internalName: "doubleFocusPower",
        displayName: "Self-immolation",
        flavorText: "You're on fire! ... Doubles the rate at which you gain resources yourself.",
        cost: {
            berries: 10000,
            wood: 10000,
        },
        purchased: false,
        effect: function () {
            this.focusPower *= 2;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 1000);
        },
    },


    // World prestige upgrades (hopefully temporary)
    // TODO: prestige rework, remove all these plz
    "lushOkra0": {
        internalName: "lushOkra0",
        displayName: "Lush okra piece #0",
        flavorText: "I'll be honest, this one is just for testing the game more easily",
        cost: {
            wood: 0,
        },
        purchased: false,
        effect: function () {
            // TODO: v hardcoded rn
            this.world.okraGain += 1;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 0);
        }
    },
    "lushOkra1": {
        internalName: "lushOkra1",
        displayName: "Lush okra piece #1",
        flavorText: "Your trip to the lush biome has not been in vain!",
        cost: {
            wood: 0,
        },
        purchased: false,
        effect: function () {
            // TODO: v hardcoded rn
            this.world.okraGain += 1;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 10000 && this.world.resources.flowers.amount >= 1000);
        }
    },
    "lushOkra2": {
        internalName: "lushOkra2",
        displayName: "Lush okra piece #2",
        flavorText: "Two pieces of okra here?  That's overpowered, seriously",
        cost: {
            wood: 0,
        },
        purchased: false,
        effect: function () {
            // TODO: v hardcoded rn
            this.world.okraGain += 1;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 30000 && this.world.resources.flowers.amount >= 3000);
        }
    },
    "woodedOkra1": {
        internalName: "woodedOkra1",
        displayName: "Wooded okra piece #1",
        flavorText: "Your trip to the wooded biome has not been in vain!",
        cost: {
            wood: 0,
        },
        purchased: false,
        effect: function () {
            // TODO: v hardcoded rn
            this.world.okraGain += 1;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 5000 && this.world.resources.amber.amount >= 1000);
        }
    },
    "woodedOkra2": {
        internalName: "woodedOkra2",
        displayName: "Wooded okra piece #2",
        flavorText: "Shucks I guess this is the end of the game huh",
        cost: {
            wood: 0,
        },
        purchased: false,
        effect: function () {
            // TODO: v hardcoded rn
            this.world.okraGain += 1;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 10000 && this.world.resources.amber.amount >= 10000);
        }
    },
};

function createUpgrade (name, upgradeDiv, world) {
    return new Upgrade({ ...deepCopy(upgradeConfigs[name]), upgradeDiv: upgradeDiv, world: world });
}

function loadUpgrade (save, upgradeDiv, world) {
    const config = deepCopy(upgradeConfigs[save.n]);
    config.purchased = save.p === 1 ? true : false;
    config.resourceDiv = upgradeDiv;
    config.world = world;

    return new Upgrade(config);
}

export { createUpgrade, loadUpgrade };
