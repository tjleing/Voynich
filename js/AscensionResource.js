// @ts-check

import { deepCopy } from "./Utils.js";
import { ascensionResourceConfigs } from "./configs/ResourceConfigs.js";
import { Resource } from "./Resource.js";

class AscensionResource extends Resource {
    constructor ({
        internalName,
        displayNameSingular,
        displayNamePlural,
        flavorText,
        startingAmount,
        calculateAmountGained,
        active
    }) {
        super(...args);
        this.internalName = internalName;
        this.displayNameSingular = displayNameSingular;
        this.displayNamePlural = displayNamePlural;
        this.flavorText = flavorText;
        // TODO: amount vs. quantity
        this.amount = startingAmount;
        this.calculateAmountGained = calculateAmountGained;
        this.isFocused = false;
        this.active = active;

        this.ascension = this.container;
        this.calculateAmountGained = calculateAmountGained();
    }

    tick() {
        // ???????????????
        // aaahhhhhhhhhhhhhhhhhhhhhhhhh
        // no this should all be composition instead of
        // inheritance?????

        // the other option here is to do a tickAdd from
        // the container, if we have like an ascResourceSet
        // 
        // okay the thing is that we don't ever tickAdd an asc resource (for now)
        // because we want to do a weird tickAdd thing...
        // we want to add when we asc
        // also we want to change the draw to reflect
        // we'll have multiple resources, so maybe have a flag or something?
        this.calculateAmountGained();
    }
}

function createAscensionResource (name, resourceDiv, world) {
    return new AscensionResource({ ...deepCopy(ascensionResourceConfigs[name]), resourceDiv: resourceDiv, container: world });
}

function loadAscensionResource (save, resourceDiv, world) {
    const config = deepCopy(ascensionResourceConfigs[save.n]);
    config.amount = save.am;
    config.active = save.ac === 1 ? true : false;
    config.resourceDiv = resourceDiv;
    config.container = world;

    return new AscensionResource(config);
}

function clearAscensionResources () {
    const prestige = document.getElementById("prestigeResources");
    prestige.innerHTML = "";
}

export { createAscensionResource, loadAscensionResource, clearAscensionResources };
