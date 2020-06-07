// @ts-check

import { deepCopy } from "./Utils.js";
import { worldUpgradeConfigs } from "./configs/UpgradeConfigs.js";
import { Upgrade } from "./Upgrade.js";

class WorldUpgrade extends Upgrade {
    constructor (...args) {
        super(...args);
        this.world = this.container;
    }
}


function createWorldUpgrade (name, world) {
    return new WorldUpgrade({ ...deepCopy(worldUpgradeConfigs[name]), container: world });
}

function loadWorldUpgrade (save, world) {
    const config = deepCopy(worldUpgradeConfigs[save.n]);
    config.purchased = save.p === 1 ? true : false;
    config.container = world;

    return new WorldUpgrade(config);
}

export { createWorldUpgrade, loadWorldUpgrade };