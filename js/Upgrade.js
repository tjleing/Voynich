// @ts-check

class Upgrade {
    constructor (name, cost, effect, unlockCondition, isUnlocked, isAffordable, isPurchased) {
        this.name = name;
        this.cost = cost;
        this.effect = effect;
        this.unlockCondition = unlockCondition;
        this.isUnlocked = isUnlocked;
        this.isAffordable = isAffordable;
        this.isPurchased = isPurchased;
    }

    tick () {
        // TODO: also check if the upgrade is affordable
        if (this.isUnlocked) {
            return;
        }
        if (this.unlockCondition()) {
            this.isUnlocked = true;
        }
    }

    buy () {
        // TODO: subtract cost from stores of resource
        // TODO: double-check isAffordable to avoid theoretical single-frame purchases of two upgrades or something
        if (this.isUnlocked && this.isAffordable && !this.isPurchased) {
            this.effect();
            this.isPurchased = true;
        }
    }

    // Saving and loading
    load (saveString) {
        let saveComponents = saveString.split("$");
        this.isPurchased = saveComponents[0] === "true";
    }

    save () {
        let saveComponents = [];
        saveComponents.push(this.isPurchased);

        return saveComponents.join("$");
    }
}

export { Upgrade };
