// @ts-check

import { createResource } from "./Resource.js";

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
        let saveComponents = [];
        for (const resource of this.resourceList) {
            saveComponents.push(resource.save());
        }
        return saveComponents;
    }

    load (saveComponents) {
        for (let i = 0; i < this.resourceList.length; ++i) {
            this.resourceList[i].load(saveComponents[i]);
        }
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

export { WorldResourceSet };
