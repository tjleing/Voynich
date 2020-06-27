// @ts-check

import { createSet, loadSet } from './Set.js';
import { createCreature, loadCreature } from "./Creature.js";

function createWorldCreatureSet (creatureNames, creatureDiv, world) {
    return createSet(creatureNames, creatureDiv, createCreature, world);
}

function loadWorldCreatureSet (save, creatureDiv, world) {
    return loadSet(save, creatureDiv, loadCreature, world);
}

export { createWorldCreatureSet, loadWorldCreatureSet };
