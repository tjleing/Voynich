// @ts-check

class Resource {
    constructor ({
        internalName,
        displayNameSingular,
        displayNamePlural,
        flavorText,
        amount,
        active,
        resourceDiv,
        container,
    }) {
        this.internalName = internalName;
        this.displayNameSingular = displayNameSingular;
        this.displayNamePlural = displayNamePlural;
        this.flavorText = flavorText;
        // TODO: amount vs. quantity
        this.amount = amount;
        this.amountPerTick = 0;
        this.active = active;
        this.resourceDiv = resourceDiv;
        this.container = container;

        if (this.active) {
            this.constructDOM();
        }
    }

    constructDOM () {
        if (this.amountDiv) {
            // Already constructed the HTML.
            return;
        }
        this.amountDiv = document.createElement("div");
        this.amountDiv.classList.add("tooltip");
        this.amountSpan = document.createElement("span");
        this.amountDiv.appendChild(this.amountSpan);

        this.tooltipSpan = document.createElement("span");
        this.tooltipSpan.classList.add("tooltipText");

        this.amountDiv.appendChild(this.tooltipSpan);

        this.resourceDiv.appendChild(this.amountDiv);
    }

    add (amount) {
        this.amount += amount;
    }

    consume (amount) {
        this.amount -= amount;
    }

    // Saving (loading is special because it depends on the config)
    save () {
        const save = {};
        save.n = this.internalName;
        save.am = this.amount;
        save.ac = this.active ? 1 : 0;

        return save;
    }
}

export { Resource };
