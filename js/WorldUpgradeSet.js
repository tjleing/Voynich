// @ts-check

class WorldUpgradeSet {
    constructor (upgradeList) {
        this.upgradeList = upgradeList;

        this.Map = {};
        for (const upgrade of this.upgradeList) {
            this.Map[upgrade.name] = upgrade;
        }
    }

    draw () {
        for (const upgrade of this.upgradeList) {
            upgrade.draw();
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
        for (let i = 0; i < this.upgradeList.length) {
            upgradeList[i].load(saveComponents[i]);
        }
    }
}
