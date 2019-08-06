// @ts-check

class World {
    constructor (resourceList, ) {
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
}

export { World };
