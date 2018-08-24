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
        if (this.isUnlocked) {
            return;
        }
        if (this.unlockCondition()) {
            this.isUnlocked = true;
        }
    }

    buy () {
        // TODO: subtract cost from stores of resource
        if (this.isUnlocked && this.isAffordable && !this.isPurchased) {
            this.effect();
            this.isPurchased = true;
        }
    }
}

export { Upgrade };
