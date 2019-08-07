// @ts-check

import { createTab } from "./Tab.js";

class TabSet {
    constructor (tabInfo, tabDiv, activeIndex, world) {
        this.tabList = [];
        this.tabDiv = tabDiv;
        this.activeIndex = activeIndex;

        for (const info of tabInfo) {
            const tab = createTab(info, world);
            this.tabList.push(tab);
        }
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
