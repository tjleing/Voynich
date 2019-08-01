// @ts-check

class WorldCreatureSet {
    constructor (creatureList) {
        // I'm *pretty* sure that not copying here is a legit thing to do
        this.creatureList = creatureList;

        for (const creature of this.creatureList) {
            this[creature.name] = creature;
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
        for (let i = 0; i < this.creatureList.length) {
            creatureList[i].load(saveComponents[i]);
        }
    }
}
