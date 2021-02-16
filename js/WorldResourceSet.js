// @ts-check

import { Set } from "./Set.js";
import { createWorldResource, loadWorldResource } from "./WorldResource.js";

class WorldResourceSet extends Set {
    constructor (...args) {
        super(...args);
    }

    save () {
        let save = super.save();
        save.f = this.focusedResource ? this.focusedResource.internalName : undefined;
        return save;
    }

    setFocusedResource (newFocusedResource) {
        // Unfocus previous resource
        if (this.focusedResource !== undefined) {
            this.focusedResource.isFocused = false;
        }
        // Focus new resource as long as it wasn't the previous one
        if (newFocusedResource !== this.focusedResource) {
            newFocusedResource.isFocused = true;
            this.focusedResource = newFocusedResource;
        }
        else {
            this.focusedResource = undefined;
        }
    }

    // TODO: idk where this should go, but should do something when there are no upgrades to buy -- right now it looks weird if there's nothing to buy (c.f. cookie clicker?)
}

// TODO: reinvestigate if there's a way to call the createSet fn and construct a WorldResourceSet instead of a Set
//       might have to be a method instead of a function?
function createWorldResourceSet (resourceNames, div, world) {
    const list = [];

    for (const name of resourceNames) {
        list.push(createWorldResource(name, div, world));
    }

    return new WorldResourceSet(list, div);
}

function loadWorldResourceSet (save, div, world) {
    const list = [];
    for (const itemSave of save.l) {
        list.push(loadWorldResource(itemSave, div, world));
    }

    const set = new WorldResourceSet(list, div);
    for (const resource of set.list) {
        if (resource.internalName === save.f) {
            set.setFocusedResource(resource);
            break;
        }
    }
    return set;
}

export { createWorldResourceSet, loadWorldResourceSet };