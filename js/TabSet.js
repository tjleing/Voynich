// @ts-check

import { createTab } from "./Tab.js";

class TabSet {
    constructor (tabInfo, tabDiv, activeIndex, world) {
        this.tabList = [];
        this.tabDiv = tabDiv;
        this.activeIndex = activeIndex;

        for (let i = 0; i<tabInfo.length; ++i) {
            const info = tabInfo[i];
            const tab = createTab(info, tabDiv, world);
            tab.button.onclick = this.setActive.bind(this, i);
            this.tabList.push(tab);
        }
        this.setActive(activeIndex);
    }

    tick () {
        for (const tab of this.tabList) {
            tab.tick();
        }
    }

    draw () {
        for (const tab of this.tabList) {
            tab.draw();
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
        this.tabList[this.activeIndex].button.classList.remove("active");

        // Set this tab active
        newTab.divToShow.style.display = "block";
        newTab.button.classList.add("active");

        this.activeIndex = newTabIndex;
    }

    save () {
        return this.activeIndex;
    }

    load (saveComponents) {
        this.activeIndex = parseInt(saveComponents, 10);
    }

    clear () {
        this.tabList = [];
        this.tabDiv.innerHTML = "";
    }
}

export { TabSet };
