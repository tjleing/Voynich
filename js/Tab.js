// @ts-check

class Tab {
    constructor({id, buttonText, divToShow, unlockCondition}) {
        this.unlockCondition = unlockCondition;
        this.unlocked = this.unlockCondition();

        this.button = document.createElement("button");
        this.button.id = id;
        if (this.unlocked) {
            // TODO: also have tooltips on upgrade tabs; hints as to unlock conditions when locked, and
            // description always?
            // TODO: rethink naming about unlocking vs visibility
            this.button.innerHTML = buttonText;
        }
        else {
            this.button.innerHTML = "???";
        }
        this.button.onclick = this.setActive.bind(this);

        this.divToShow = divToShow;

        Tab._buttons.push(this.button);
        Tab._divs.push(this.divToShow);
        Tab._tabDiv.appendChild(this.button);
    }

    setActive() {
        // Activate this tab and deactivate all others.
        // OPTIMIZE: use variables for Tab._activeButton and Tab._activeDiv instead of looping

        if (!this.unlocked) {
            return;
        }

        // Set all other tabs inactive
        for (const div of Tab._divs) {
            div.style.display = "none";
        }
        for (const button of Tab._buttons) {
            button.classList.remove("active");
        }

        // Set this tab active
        this.divToShow.style.display = "block";
        this.button.classList.add("active");
    }

    tick() {
        if (this.unlockCondition()) {
            // TODO: grey out when locked; no cursor hover
            // TODO: ungrey button here
            this.unlocked = true;
        }
    }
}

function clearTabs () {
    Tab._buttons = [];
    Tab._divs = [];
    Tab._tabDiv = document.getElementById("tabs");

    Tab._tabDiv.innerHTML = "";
}

export { clearTabs, Tab };
