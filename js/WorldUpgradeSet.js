// @ts-check
import { createWorldUpgrade, loadWorldUpgrade } from "./WorldUpgrade.js";

class WorldUpgradeSet {
    constructor (upgradeList, upgradeDiv, world) {
        this.upgradeList = upgradeList;
        this.upgradeDiv = upgradeDiv;

        for (const upgrade of upgradeList) {
            this[upgrade.internalName] = upgrade;
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

    clear () {
        for (const upgrade of this.upgradeList) {
            this[upgrade.name] = undefined;
        }
        this.upgradeList = [];
        this.upgradeDiv.innerHTML = "";
    }
}

function createWorldUpgradeSet (upgradeNames, upgradeDiv, world) {
    const upgradeList = [];

    for (const upgradeName of upgradeNames) {
        // TODO: consider whether it's a good idea to have both a list and a map of the same thing
        upgradeList.push(createWorldUpgrade(upgradeName, world));
    }

    return new WorldUpgradeSet(upgradeList, upgradeDiv, world);
}

function loadWorldUpgradeSet (save, upgradeDiv, world) {
    const upgradeList = [];
    for (const upgradeSave of save) {
        upgradeList.push(loadWorldUpgrade(upgradeSave, world));
    }

    return new WorldUpgradeSet(upgradeList, upgradeDiv, world);
}


export { createWorldUpgradeSet, loadWorldUpgradeSet };
