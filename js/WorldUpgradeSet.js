// @ts-check

import { createSet, loadSet } from './Set.js';
import { createWorldUpgrade, loadWorldUpgrade } from "./WorldUpgrade.js";

function createWorldUpgradeSet (upgradeNames, upgradeDiv, world) {
    return createSet(upgradeNames, upgradeDiv, createWorldUpgrade, world);
}

function loadWorldUpgradeSet (save, upgradeDiv, world) {
    return loadSet(save, upgradeDiv, loadWorldUpgrade, world);
}


export { createWorldUpgradeSet, loadWorldUpgradeSet };