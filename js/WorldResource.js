// @ts-check

import { deepCopy, fix } from "./Utils.js";
import { worldResourceConfigs } from "./configs/ResourceConfigs.js";
import { Resource } from "./Resource.js";
import { settings } from "./Settings.js";

class WorldResource extends Resource {
    constructor(args) {
        super(args);
        this.isFocused = false;
        this.hitpoints = args.hitpoints;
        this.world = this.container;

        if (this.active) {
            this.amountDiv.onclick = () => { this.world.resources.setFocusedResource(this) };
        }
    }

    draw() {
        if (!this.active) {
            if (this.amount > 0) {
                this.active = true;
                this.constructDOM();
                // TODO: does this really need to be here twice?  code smell
                this.amountDiv.onclick = () => { this.world.resources.setFocusedResource(this) };
            }
            else {
                return;
            }
        }

        const fixedAmount = fix(this.amount);
        const nameToUse = fixedAmount === 1 ? this.displayNameSingular : this.displayNamePlural;
        const amountPerSecond = fix(this.amountPerTick * settings.fps * 100) / 100;

        const plus = amountPerSecond >= 0 ? "+" : ""; // + if amountPerSecond positive, nothing if negative (it'll have its own negative)
        const newTooltipSpanHTML = `<span class="tooltipTextInner">${this.flavorText}<br><br>Currently: ${plus}${amountPerSecond} per second<hr></span>`;
        if (this.tooltipSpan.innerHTML !== newTooltipSpanHTML) {
            this.tooltipSpan.innerHTML = newTooltipSpanHTML;
        }

        this.amountSpan.textContent = `${fixedAmount} ${nameToUse} (${plus}${amountPerSecond}/sec)`;

        // UI change if current resource is focused
        if (this.isFocused) {
            this.amountSpan.style.fontWeight = 'bold';
        }
        else {
            this.amountSpan.style.fontWeight = '';
        }
    }

    // To keep track of the resource gain per tick (and consequently per second),
    // use tick to zero out the gain, and then for adding or consuming the
    // resource, use tickAdd and tickConsume.  When buying (or other actions
    // that shouldn't be tracked in resource gain per second, like selling),
    // use add and consume.
    tick() {
        this.amountPerTick = 0;
    }

    tickAdd(amount) {
        this.amount += amount;
        this.amountPerTick += amount;
    }

    tickConsume(amount) {
        this.amount -= amount;
        this.amountPerTick -= amount;
    }

    tickFocus(amount) {
        this.tickAdd(amount / this.hitpoints / settings.fps);
    }

}


function createWorldResource(name, resourceDiv, world) {
    return new WorldResource({ ...deepCopy(worldResourceConfigs[name]), resourceDiv: resourceDiv, container: world });
}

function loadWorldResource(save, resourceDiv, world) {
    const config = deepCopy(worldResourceConfigs[save.n]);
    config.amount = save.am;
    config.active = save.ac === 1 ? true : false;
    config.resourceDiv = resourceDiv;
    config.container = world;

    return new WorldResource(config);
}

export { createWorldResource, loadWorldResource };
