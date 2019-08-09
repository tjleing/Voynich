// @ts-check

class World {
    constructor ({resourceNames, }) {
        this.constructDOM();

        this.resources = new WorldResourceSet(resourceList);
        this.focusPower = 1; // TODO: put in Stats or something

        this.resources = new WorldResourceSet(resourceNames, resourceDiv, this);
        this.creatures = new WorldCreatureSet(creatureNames);
        this.upgrades = new WorldUpgradeSet(upgradeNames);

        this.tabs = new TabSet();

        clearNews();

        setAllSettings({"bgColor": "#E82B2B", "fps": 60, "saveTime": 5});

        this.createResources();
        this.createCreatures();
        this.createUpgrades();
        this.createAchievements();
        this.createPrestige();
        this.createTabs();

        this.news = new News();
    }

    createTabs () {
        this.tabs.push(
            new Tab(
                {
                    id: "creatureTab",
                    buttonText: "Creatures",
                    divToShow: document.getElementById("creatures"),
                    unlockCondition: () => {return true;},
                }
            )
        )
        this.tabs.push(
            new Tab(
                {
                    id: "upgradeTab",
                    buttonText: "Upgrades",
                    divToShow: document.getElementById("upgrades"),
                    unlockCondition: () => {return true;},
                }
            )
        )
        this.tabs.push(
            new Tab(
                {
                    id: "achievementTab",
                    buttonText: "Achievements",
                    divToShow: document.getElementById("achievements"),
                    unlockCondition: () => {return true;},
                }
            )
        )
        this.tabs.push(
            new Tab(
                {
                    id: "prestigeTab",
                    buttonText: "Another one...",
                    divToShow: document.getElementById("prestige"),
                    unlockCondition: () => {return this.resources.wood.amount >= 100000;},
                }
            )
        )

        this.tabs[0].setActive();
    }

    tick () {
        this.resources.tick();
        this.creatures.tick();
        this.upgrades.tick();
    }

    constructDOM () {
        this.worldDiv = document.createElement("div");
        document.getElementById("game").appendChild(this.worldDiv);

        this.worldDiv.innerHTML = `
            <div id="leftpanel" class="game">
            <div id="resources"></div>
            </div>
            <div id="middlepanel" class="game"><div id="middiv"></div><div id="middiv2"></div><div id="mousediv"></div><span id="save"></span></div>
            <div id="rightpanel" class="game">
                <button>"Mute"</button>
                <button id="import">Load save!</button>
                <button id="export">Export save!</button>
                <button id="hardReset">HARD RESET</button>
                <hr />
                <div class="tabs" id="tabs"></div>
                <div id="upgrades"></div>
                <div id="creatures"></div>
                <div id="achievements"></div>
                <div id="prestige">
                      <div id="prestigeResourceAmounts"></div>
                      <div id="prestigeInfo"></div>
                </div>
            </div>
        `;
        const leftPanel = this.div.children[0];
        this.resourcesDiv = leftPanel.firstChild;

        const middlePanel = this.div.children[1];
        // TODO: news div?

        const rightPanel = this.div.children[2];
        this.tabDiv = rightPanel.children[5];
        this.upgradeDiv = rightPanel.children[6];
        this.creatureDiv = rightPanel.children[7];
        this.achievementDiv = rightPanel.children[8];
        this.prestigeDiv = rightPanel.children[9];

        console.log(this);
    }
}

export { World };
