// @ts-check

class Tab {
    constructor ({buttonText, divToShow, unlockCondition, tabDiv}) {
        this.unlockCondition = unlockCondition;
        this.unlocked = this.unlockCondition();
        this.buttonText = buttonText;

        this.button = document.createElement("button");
        if (this.unlocked) {
            // TODO: also have tooltips on upgrade tabs; hints as to unlock conditions when locked, and
            // description always?
            // TODO: rethink naming about unlocking vs visibility
            this.button.innerHTML = this.buttonText;
        }
        else {
            this.button.innerHTML = "???";
        }

        this.divToShow = divToShow;
        this.divToShow.style.display = "none";
        this.button.classList.remove("active");

        tabDiv.appendChild(this.button);
    }

    tick () {
        if (this.unlockCondition()) {
            // TODO: grey out when locked; no cursor hover
            // TODO: ungrey button here
            this.unlocked = true;
            this.button.innerHTML = this.buttonText;
        }
    }
}

function createTab (config, tabDiv) {
    return new Tab({ ...config, tabDiv: tabDiv });
}


export { createTab };
