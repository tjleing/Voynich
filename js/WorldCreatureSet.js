// @ts-check
import { createCreature } from "./Creature.js";

class WorldCreatureSet {
    constructor (creatureNames, creatureDiv) {
        this.creatureList = [];
        this.creatureDiv = creatureDiv;

        for (const creatureName of creatureNames) {
            // TODO: consider whether it's a good idea to have both a list and a map of the same thing
            let creature = createCreature(creatureName, creatureDiv);
            this[creatureName] = creature;
            this.creatureList.push(creature);
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

    load (saveComponents) {
        for (let i = 0; i < this.creatureList.length; ++i) {
            this.creatureList[i].load(saveComponents[i]);
        }
    }

    clear () {
        for (const creature of this.creatureList) {
            this[creature.name] = creature;
        }
        this.creatureList = [];
        this.creatureDiv.innerHTML = "";
    }
}

export { WorldCreatureSet };
