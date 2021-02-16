const ascensionConfigs = {
    vanilla: {
        resourceNames: ["okra"],
        creatureNames: [],
        upgradeNames: [],
        // TODO: add back in when we've created this:
        // upgradeNames: ["doubleOkra"],
        baseWorlds: ["lush", "wooded"],
    },
};

// TODO: lift up like we did for baseWorlds
const baseAscensions = ["vanilla"];

export { ascensionConfigs, baseAscensions };