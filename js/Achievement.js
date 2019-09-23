// @ts-check
import { notify } from "./Utils.js";

class Achievement {
    constructor ({displayName, lockedFlavorText, unlockedFlavorText, unlockCondition, effect}) {
        this.displayName = displayName;
        this.lockedFlavorText = lockedFlavorText;
        this.unlockedFlavorText = unlockedFlavorText;
        this.unlockCondition = unlockCondition;
        this.unlocked = this.unlockCondition();
        this.effect = effect;

        this.div = document.createElement("div");
        this.div.innerHTML = `${this.displayName}`;
        this.div.classList.add("tooltip");
        this.div.classList.add("achievement");

        this.tooltipSpan = document.createElement("span");
        this.tooltipSpan.classList.add("tooltipText");
        this.div.appendChild(this.tooltipSpan);

        document.getElementById("achievements").append(this.div);
    }

    draw () {
        // TODO: only overwrite innerHTML if it changes (i.e., set it and spaghett it)
        // for real i.e. change it on effect()
        let innerSpanHTML;
        if (this.unlocked) {
            this.div.classList.add("achievement-unlocked");
            innerSpanHTML = `<span class="tooltipTextInner">${this.unlockedFlavorText}</span>`;
        }
        else {
            // TODO: Templated to show progress?  Pull a realm grinder and just show % completion?
            this.div.classList.remove("achievement-unlocked");
            innerSpanHTML = `<span class="tooltipTextInner">${this.lockedFlavorText}</span>`;
        }

        if (this.tooltipSpan.innerHTML !== innerSpanHTML) {
            this.tooltipSpan.innerHTML = innerSpanHTML;
        }
    }

    tick () {
        if (!this.unlocked && this.unlockCondition()) {
            // TODO: grey out when locked; no cursor hover
            // TODO: ungrey button here
            this.unlocked = true;
            this.effect();
            notify(`Achievement <b>${this.displayName}</b> unlocked!`);
        }
    }

    // Saving and loading
    load (saveString) {
        let saveComponents = saveString.split("$");
        this.unlocked = saveComponents[0] === "1";
        if (this.unlocked) {
            this.effect();
        }
    }

    save () {
        // TODO: compress
        let saveComponents = [];
        saveComponents.push(this.unlocked ? "1" : "0");

        return saveComponents.join("$");
    }
}

function clearAchievements () {
    document.getElementById("achievements").innerHTML = "";
}

export { clearAchievements, Achievement };
