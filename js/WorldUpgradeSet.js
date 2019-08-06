// @ts-check
import { createUpgrade } from "./Upgrade.js";

class WorldUpgradeSet {
    constructor (upgradeNames, upgradeDiv, world) {
        this.upgradeList = [];
        this.upgradeDiv = upgradeDiv;

        for (const upgradeName of upgradeNames) {
            const upgrade = createUpgrade(upgradeName, upgradeDiv, world);
            this[upgradeName] = upgrade;
            this.upgradeList.push(upgrade);
        }
    }

    tick () {
        for (const upgrade of this.upgradeList) {
            upgrade.tick();
        }
    }

    draw () {
        for (const upgrade of this.upgradeList) {
            upgrade.draw();
        }
    }

    forEach (operation) {
        for (const upgrade of this.upgradeList) {
            operation(upgrade);
        }
    }

    save () {
        let saveComponents = [];
        for (const upgrade of this.upgradeList) {
            saveComponents.push(upgrade.save());
        }
        return saveComponents;
    }

    load (saveComponents) {
        for (let i = 0; i < this.upgradeList.length; ++i) {
            this.upgradeList[i].load(saveComponents[i]);
        }
    }

    clear () {
        for (const upgrade of this.upgradeList) {
            this[upgrade.name] = undefined;
        }
        this.upgradeList = [];
        this.upgradeDiv.innerHTML = "";
    }
}

export { WorldUpgradeSet };
