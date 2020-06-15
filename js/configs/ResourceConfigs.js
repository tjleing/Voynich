const worldResourceConfigs = {
    // 1. Lush
    "berries": {
        internalName: "berries",
        displayNameSingular: "Liquid Gold Berry",
        displayNamePlural: "Liquid Gold Berries",
        flavorText: "It's worth its weight in liquid gold berries.",
        amount: 0,
        hitpoints: 1,
        active: true,
    },
    "wood": {
        internalName: "wood",
        displayNameSingular: "Branch of Mahogany",
        displayNamePlural: "Branches of Mahogany",
        flavorText: "You could carve a nice sculpture out of one of these. nice!",
        amount: 0,
        hitpoints: 1,
        active: true,
    },
    "flowers": {
        internalName: "flowers",
        displayNameSingular: "Meadow Lily",
        displayNamePlural: "Meadow Lilies",
        flavorText: "The rarest flower!",
        amount: 0,
        hitpoints: 20,
        active: true,
    },

    // 2. Wooded
    "amber": {
        internalName: "amber",
        displayNameSingular: "Chunk of Amber",
        displayNamePlural: "Chunks of Amber",
        flavorText: "That liquid gold!  Maybe there's a bug in this one...",
        amount: 0,
        hitpoints: 0.5,
        active: true,
    },
    "maplesyrup": {
        internalName: "maplesyrup",
        displayNameSingular: "Drop of Maple Syrup",
        displayNamePlural: "Drops of Maple Syrup",
        flavorText: "Tap that tree and wait!  Exhilirating.",
        amount: 0,
        hitpoints: 2,
        active: true,
    },
    "spamber": {
        internalName: "spamber",
        displayNameSingular: "Chunk of Spamber",
        displayNamePlural: "Chunks of Spamber",
        flavorText: "Spiced amber! ... it's disgusting.",
        amount: 0,
        hitpoints: 4,
        active: false,
    },
};

const ascensionResourceConfigs = {};

export { worldResourceConfigs, ascensionResourceConfigs };