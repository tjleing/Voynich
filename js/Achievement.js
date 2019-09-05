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

        /*
        Achievement._divs.push(this.div);
        Achievement._achievementDiv.appendChild(this.div);
        */
    }

    draw () {
        if (this.unlocked) {
            this.div.classList.add("achievement-unlocked");
            this.tooltipSpan.innerHTML = `${this.unlockedFlavorText}`;
        }
        else {
            // TODO: Templated to show progress?  Pull a realm grinder and just show % completion?
            this.div.classList.remove("achievement-unlocked");
            this.tooltipSpan.innerHTML = `${this.lockedFlavorText}`;
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
    /*
    Achievement._divs = [];
    Achievement._achievementDiv = document.getElementById("achievements");

    Achievement._achievementDiv.innerHTML = "";
    */
}

export { clearAchievements, Achievement };
