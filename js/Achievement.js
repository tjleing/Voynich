// @ts-check
import { notify } from "./Utils.js";

class Achievement {
    constructor ({id, displayName, lockedFlavorText, unlockedFlavorText, unlockCondition, effect}) {
        this.displayName = displayName;
        this.lockedFlavorText = lockedFlavorText;
        this.unlockedFlavorText = unlockedFlavorText;
        this.unlockCondition = unlockCondition;
        this.unlocked = this.unlockCondition();
        this.effect = effect;

        this.div = document.createElement("div");
        this.div.id = id;

        Achievement._divs.push(this.div);
        Achievement._achievementDiv.appendChild(this.div);
    }

    draw () {
        if (this.unlocked) {
            this.div.innerHTML = `${this.displayName}: ${this.unlockedFlavorText}`;
        }
        else {
            // TODO: Templated to show progress?  Pull a realm grinder and just show % completion?
            this.div.innerHTML = `${this.displayName}: ${this.lockedFlavorText}`;
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
}

function clearAchievements () {
    Achievement._divs = [];
    Achievement._achievementDiv = document.getElementById("achievements");

    Achievement._achievementDiv.innerHTML = "";
}

export { clearAchievements, Achievement };
