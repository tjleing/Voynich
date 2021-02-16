// @ts-check

import { deepCopy } from "./Utils.js";
import { ascensionUpgradeConfigs } from "./configs/UpgradeConfigs.js";
import { Upgrade } from "./Upgrade.js";

class AscensionUpgrade extends Upgrade {
    constructor (...args) {
        super(...args);
        this.ascension = this.container;
    }
}


function createAscensionUpgrade (name, ascension) {
    return new AscensionUpgrade({ ...deepCopy(ascensionUpgradeConfigs[name]), container: ascension });
}

function loadAscensionUpgrade (save, ascension) {
    const config = deepCopy(ascensionUpgradeConfigs[save.n]);
    config.purchased = save.p === 1 ? true : false;
    config.container = ascension;

    return new AscensionUpgrade(config);
}

export { createAscensionUpgrade, loadAscensionUpgrade };