// @ts-check

class Set {
    constructor (list, div) {
        this.list = list;
        this.div = div;

        for (const item of list) {
            this[item.internalName] = item;
        }
    }

    tick () {
        for (const item of this.list) {
            item.tick();
        }
    }

    // TODO: empty Set?  for example, text for no unlocked upgrades, etc.
    // possibly consider returning a bool from each draw() that says if it
    // could draw anything or not?
    draw () {
        for (const item of this.list) {
            item.draw();
        }
    }

    forEach (operation) {
        for (const item of this.list) {
            operation(item);
        }
    }

    save () {
        let save = {};
        save.l = [];
        for (const item of this.list) {
            save.l.push(item.save());
        }
        return save;
    }

    clear () {
        for (const item of this.list) {
            this[item.name] = undefined;
        }
        this.list = [];
        this.div.innerHTML = "";
    }
}

function createSet (names, div, createFunction, container) {
    const list = [];

    for (const name of names) {
        list.push(createFunction(name, div, container));
    }

    return new Set(list, div);
}

function loadSet (save, div, loadFunction, container) {
    const list = [];
    for (const itemSave of save.l) {
        list.push(loadFunction(itemSave, div, container));
    }

    return new Set(list, div);
}

export { createSet, loadSet, Set };
