// @ts-check

import { createResource, loadResource } from "./Resource.js";

class WorldResourceSet {
    constructor (resourceNames, resourceDiv, world) {
        // TODO: maybe just this.list and this.div?
        this.resourceList = [];
        this.resourceDiv = resourceDiv;

        for (const resourceName of resourceNames) {
            const resource = createResource(resourceName, resourceDiv, world);
            this[resourceName] = resource;
            this.resourceList.push(resource);
        }
    }

    tick () {
        for (const resource of this.resourceList) {
            resource.startTick();
        }
    }

    draw () {
        for (const resource of this.resourceList) {
            resource.draw();
        }
    }

    forEach (operation) {
        for (const resource of this.resourceList) {
            operation(resource);
        }
    }

    save () {
        let save = {};
        save.f = this.focusedResource ? this.focusedResource.internalName : undefined;
        for (const resource of this.resourceList) {
            saveComponents.push(resource.save());
        }
        return saveComponents;
    }

    clear () {
        for (const resource of this.resourceList) {
            this[resource.name] = undefined;
        }
        this.resourceList = [];
        this.resourceDiv.innerHTML = "";
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

function createWorldResourceSet (resourceNames, resourceDiv, world) {
    const resourceList = [];

    for (const resourceName of resourceNames) {
        // TODO: consider whether it's a good idea to have both a list and a map of the same thing
        resourceList.push(createResource(resourceName, resourceDiv, world));
    }

    return new WorldResourceSet(resourceList, resourceDiv, world);
}

function loadWorldResourceSet (save, resourceDiv, world) {
    const resourceList = [];
    for (const resourceSave of save.r) {
        resourceList.push(loadResource(resourceSave, resourceDiv, world));
    }

    const wrs = new WorldResourceSet(resourceList, resourceDiv, world);
    wrs.setFocusedResource(wrs[save.f]);

    return wrs;
}

export { createWorldResourceSet, loadWorldResourceSet };
