// @ts-check

class WorldCreatureSet {
    constructor (creatureList) {
        this.creatureList = creatureList;

        this.Map = {};
        for (const creature of this.creatureList) {
            this.Map[creature.name] = creature;
        }
    }

    draw () {
        for (const creature of this.creatureList) {
            creature.draw();
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
        for (let i = 0; i < this.creatureList.length) {
            creatureList[i].load(saveComponents[i]);
        }
    }
}
