// @ts-check

class Tab {
    constructor(id, buttonText, divToShow) {
        this.button = document.createElement("button");
        this.button.id = id;
        this.button.innerHTML = buttonText;
        this.button.onclick = this.setActive.bind(this);

        this.divToShow = divToShow;

        Tab._buttons.push(this.button);
        Tab._divs.push(this.divToShow);
        Tab._tabDiv.appendChild(this.button);
    }

    setActive() {
        // Activate this tab and deactivate all others.
        // OPTIMIZE: use variables for Tab._activeButton and Tab._activeDiv instead of looping
        for (const div of Tab._divs) {
            div.style.display = "none";
        }
        for (const button of Tab._buttons) {
            button.classList.remove("active");
        }

        this.divToShow.style.display = "block";
        this.button.classList.add("active");
    }
}

function clearTabs () {
    Tab._buttons = [];
    Tab._divs = [];
    Tab._tabDiv = document.getElementById("tabs");

    Tab._tabDiv.innerHTML = "";
}

export { clearTabs, Tab };
