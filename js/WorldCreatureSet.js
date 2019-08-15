// @ts-check

import { createCreature, loadCreature } from "./Creature.js";

class WorldCreatureSet {
    constructor (creatureList, creatureDiv, world) {
        this.creatureList = creatureList;
        this.creatureDiv = creatureDiv;

        for (const creature of creatureList) {
            // TODO: consider whether it's a good idea to have both a list and a map of the same thing
            this[creature.internalName] = creature;
        }
    }

    tick () {
        for (const creature of this.creatureList) {
            creature.tick();
        }
    }

    draw () {
        for (const creature of this.creatureList) {
            creature.draw();
        }
    }

    forEach (operation) {
        for (const creature of this.creatureList) {
            operation(creature);
        }
    }

    save () {
        let saveComponents = [];
        for (const creature of this.creatureList) {
            saveComponents.push(creature.save());
        }
        return saveComponents;
    }

    clear () {
        for (const creature of this.creatureList) {
            this[creature.name] = undefined;
        }
        this.creatureList = [];
        this.creatureDiv.innerHTML = "";
    }
}

function createWorldCreatureSet (creatureNames, creatureDiv, world) {
    const creatureList = [];

    for (const creatureName of creatureNames) {
        // TODO: consider whether it's a good idea to have both a list and a map of the same thing
        creatureList.push(createCreature(creatureName, creatureDiv, world));
    }

    return new WorldCreatureSet(creatureList, creatureDiv, world);
}

function loadWorldCreatureSet (save, creatureDiv, world) {
    const creatureList = [];
    for (const creatureSave of save) {
        creatureList.push(loadCreature(creatureSave, creatureDiv, world));
    }

    return new WorldCreatureSet(creatureList, creatureDiv, world);
}

export { WorldCreatureSet };
