// @ts-check

class WorldResourceSet {
    constructor (resourceList) {
        this.resourceList = resourceList;

        this.Map = {};
        for (const resource of this.resourceList) {
            this.Map[resource.name] = resource;
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
}
