const worldConfigs = {
    lush: {
        resourceNames: ["berries", "wood", "flowers"],
        creatureNames: ["weaseal", "beaverine", "buckaroo", "ptrocanfer"],
        upgradeNames: ["twoForOne", "BeaverineUp1", "everythingIsAwful", "undoAwful", "greyBG", "getPtroed", "doubleFocusPower", "lushOkra0", "lushOkra1", "lushOkra2"],
    },
    wooded: {
        resourceNames: ["amber", "maplesyrup", "spamber", "wood"],
        creatureNames: ["ambear", "spicewolf", "chuckpecker", "tasdevil"],
        upgradeNames: ["woodedOkra1", "woodedOkra2"],
    },
};

// Add your new world types here if you want them to be unlocked at the start!
// You can duplicate worlds too if you want to be able to play it twice, two
// for one deal much?
const baseWorlds = ["lush", "wooded"];

export { worldConfigs, baseWorlds };