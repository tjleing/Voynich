// @ts-check

import { createTab } from "./Tab.js";

class TabSet {
    constructor (tabInfo, tabDiv, activeIndex) {
        this.tabList = [];
        tabDiv.innerHTML = "";
        this.tabDiv = tabDiv;
        this.activeIndex = activeIndex;

        for (let i = 0; i<tabInfo.length; ++i) {
            const info = tabInfo[i];
            const tab = createTab(info, tabDiv);
            tab.button.onclick = this.setActive.bind(this, i);
            this.tabList.push(tab);
        }
        if (activeIndex) {
            this.setActive(activeIndex);
        }
        else {
            this.setActive(0);
        }
    }

    tick () {
        for (const tab of this.tabList) {
            tab.tick();
        }
    }

    forEach (operation) {
        for (const tab of this.tabList) {
            operation(tab);
        }
    }

    setActive (newTabIndex) {
        // Activate this tab and deactivate the others.

        const newTab = this.tabList[newTabIndex];

        if (!newTab.unlocked) {
            return;
        }

        // Set previous tab inactive
        this.tabList[this.activeIndex].divToShow.style.display = "none";
        this.tabList[this.activeIndex].divToShow.style.zIndex = "initial";
        this.tabList[this.activeIndex].button.classList.remove("active");

        // Set this tab active
        newTab.divToShow.style.display = "inherit";
        newTab.divToShow.style.zIndex = "5"; // Bring to front so that hovering always targets active tab
        newTab.button.classList.add("active");

        this.activeIndex = newTabIndex;
    }

    save () {
        return this.activeIndex;
    }

    load (saveComponents) {
        const loadIndex = parseInt(saveComponents, 10);
        if (loadIndex !== NaN) {
            this.setActive(loadIndex);
        }
        else {
            this.setActive(0);
        }
    }

    clear () {
        this.tabList = [];
        this.tabDiv.innerHTML = "";
    }
}

export { TabSet };
