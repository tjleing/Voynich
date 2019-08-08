// @ts-check

class World {
    constructor (resourceList, ) {
        this.constructDOM();

        this.resources = new WorldResourceSet(resourceList);
        this.focusPower = 1; // TODO: put in Stats or something
        clearResources();

        this.creatures = new WorldCreatureSet(creatureList);
        this.creatures.clear();

        this.upgrades = new WorldUpgradeSet(upgradeList);
        this.upgrades.clear();

        this.tabs = [];
        clearTabs();

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

    tick () {
        this.resources.tick();
        this.creatures.tick();
        this.upgrades.tick();
    }

    constructDOM () {
        this.worldDiv = document.createElement("div");
        document.getElementById("game").appendChild(this.worldDiv);

        this.worldDiv.innerHTML = '<div id="leftpanel" class="game">
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
		</div>';
         // TODO: replace with backticks
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
    }
}

export { World };
