// @ts-check

class Resource {
    constructor (internalName,
                 displayNameSingular,
                 displayNamePlural,
                 startingAmount=0,
                 active) {
        this.internalName = internalName;
        this.displayNameSingular = displayNameSingular;
        this.displayNamePlural = displayNamePlural;
        this.amount = startingAmount;
        this.active = active;
        Resource.Map[internalName] = this;
    }
}

Resource.Map = {};

export { Resource };
