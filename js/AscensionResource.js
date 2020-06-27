// @ts-check

import { deepCopy } from "./Utils.js";
import { ascensionResourceConfigs } from "./configs/ResourceConfigs.js";
import { Resource } from "./Resource.js";

class AscensionResource extends Resource {
    constructor (args) {
        super(args);

        // gross unpacking (not in argument list) because we need to call to super
        let {
            internalName,
            displayNameSingular,
            displayNamePlural,
            flavorText,
            startingAmount,
            calculateGain,
            active
        } = args;

        this.internalName = internalName;
        this.displayNameSingular = displayNameSingular;
        this.displayNamePlural = displayNamePlural;
        this.flavorText = flavorText;
        // TODO: amount vs. quantity
        this.amount = startingAmount;
        this.calculateGain = calculateGain;
        this.isFocused = false;
        this.active = active;

        this.toGain = 0;
        this.ascension = this.container;
    }

    // TODO: probably (slightly) different from parent
    /*
    constructDOM () {
    }
    */

    draw () {
        // TODO: adapt from worldresource
    }

    // TODO: eventually we might want to get tickadd and tickconsume back
    tick () {
        this.toGain = this.calculateGain(this.container);
    }
}

function createAscensionResource (name, resourceDiv, ascension) {
    return new AscensionResource({ ...deepCopy(ascensionResourceConfigs[name]), resourceDiv: resourceDiv, container: ascension });
}

function loadAscensionResource (save, resourceDiv, ascension) {
    const config = deepCopy(ascensionResourceConfigs[save.n]);
    config.amount = save.am;
    config.active = save.ac === 1 ? true : false;
    config.resourceDiv = resourceDiv;
    config.container = ascension;

    return new AscensionResource(config);
}

function clearAscensionResources () {
    const ascensionDiv = document.getElementById("ascensionResources");
    ascensionDiv.innerHTML = "";
}

export { createAscensionResource, loadAscensionResource, clearAscensionResources };
