// @ts-check

class WorldResourceSet {
    constructor (resourceNames, resourceDiv) {
        // TODO: maybe just this.list?
        this.resourceList = [];
        this.resourceDiv = resourceDiv;

        for (const resourceName of resourceNames) {
            const resource = createResource(resourceName);
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

    save () {
        let saveComponents = [];
        for (const resource of this.resourceList) {
            saveComponents.push(resource.save());
        }
        return saveComponents;
    }

    load (saveComponents) {
        for (let i = 0; i < this.resourceList.length) {
            resourceList[i].load(saveComponents[i]);
        }
    }

    clear () {
        for (const resource of this.resourceList) {
            this[resource.name] = undefined;
        }
        this.resourceList = [];
        this.resourceDiv.innerHTML = "";
    }
}
