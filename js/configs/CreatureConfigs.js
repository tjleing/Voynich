const creatureConfigs = {
    // 1. Lush
    "weaseal": {
        internalName: "weaseal",
        displayNameSingular: "Weaseal",
        displayNamePlural: "Weaseals",
        flavorText: "It's got fur and also... blubber?  You don't want to touch this creature at all.",
        cost: {
            berries: 1,
            wood: 5,
        },
        production: {
            berries: 1,
            wood: 0.2,
        },
        totalProduced: {
            berries: 0,
            wood: 0,
        },
        costScalingFunction:
            function () {
                this.cost["berries"] *= 1.15;
            },
        quantity: 0,
    },
    "beaverine": {
        internalName: "beaverine",
        displayNameSingular: "Beaverine",
        displayNamePlural: "Beaverines",
        flavorText: "Sometimes makes dams.  Sometimes tears apart others' dams.  Absolutely terrifying.",
        cost: {
            berries: 100,
            wood: 50,
        },
        production: {
            berries: 10,
            wood: 20,
        },
        totalProduced: {
            berries: 0,
            wood: 0,
        },
        costScalingFunction:
            function () {
                this.cost["wood"] *= 1.15;
            },
        quantity: 0,
    },
    "buckaroo": {
        internalName: "buckaroo",
        displayNameSingular: "Buckaroo",
        displayNamePlural: "Buckaroos",
        flavorText: "Jumpy and frantic but great at gathering, oh deer!",
        cost: {
            berries: 500,
            wood: 120,
            flowers: 1
        },
        production: {
            berries: 100,
            wood: 20,
            flowers: 0.01
        },
        totalProduced: {
            berries: 0,
            wood: 0,
            flowers: 0,
        },
        costScalingFunction:
            function () {
                this.cost["berries"] *= 1.15;
                this.cost["wood"] *= 1.15;
            },
        quantity: 0,
    },
    "ptrocanfer": {
        internalName: "ptrocanfer",
        displayNameSingular: "Ptrocanfer",
        displayNamePlural: "Ptrocanfers",
        flavorText: "Ridiculously expensive!  But maybe worth it?",
        cost: {
            wood: 890000,
            flowers: 50,
        },
        production: {
            berries: 100000,
            wood: 100000,
            flowers: 10,
        },
        totalProduced: {
            berries: 0,
            wood: 0,
            flowers: 0,
        },
        costScalingFunction:
            function () {
                this.cost["wood"] *= 1.15;
                this.cost["flowers"] *= 1.15;
            },
        quantity: 0,
    },

    // 2. Wooded
    "ambear": {
        internalName: "ambear",
        displayNameSingular: "Ambear",
        displayNamePlural: "Ambears",
        flavorText: "They sniff out amber-filled trees from miles away.  Some bears like honey, but these ones just take a cut of what they find.",
        cost: {
            amber: 20,
        },
        production: {
            amber: 2,
            maplesyrup: 0.5,
        },
        totalProduced: {
            amber: 0,
            maplesyrup: 0,
        },
        costScalingFunction:
            function () {
                this.cost["amber"] *= 1.3;
            },
        quantity: 0,
    },
    "spicewolf": {
        internalName: "spicewolf",
        displayNameSingular: "Spice Wolf",
        displayNamePlural: "Spice Wolf",
        flavorText: "These doggos moonlight as chefs, but only during the full moon.  Also, they love anime.",
        cost: {
            amber: 100,
            maplesyrup: 20,
        },
        production: {
            amber: -10,
            spamber: 7,
        },
        totalProduced: {
            amber: 0,
            spamber: 0,
        },
        costScalingFunction:
            function () {
                this.cost["amber"] *= 1.3;
                this.cost["maplesyrup"] *= 1.15;
            },
        quantity: 0,
    },
    "chuckpecker": {
        internalName: "chuckpecker",
        displayNameSingular: "Chuckpecker",
        displayNamePlural: "Chuckpeckers",
        flavorText: "Not only can they harvest nutrients from tree trunks, but they can also toss the logs back home!  But how many?",
        cost: {
            maplesyrup: 400,
            spamber: 800,
        },
        production: {
            maplesyrup: 10,
            wood: 8,
        },
        totalProduced: {
            maplesyrup: 0,
            wood: 0,
        },
        costScalingFunction:
            function () {
                this.cost["spamber"] *= 1.3;
                this.cost["maplesyrup"] *= 1.15;
            },
        quantity: 0,
    },
    "tasdevil": {
        internalName: "tasdevil",
        displayNameSingular: "Tastymanian Devil",
        displayNamePlural: "Tastymanian Devils",
        flavorText: "Rarely seen even in fiction.  Has a major sweet tooth, no, 42 of them!",
        cost: {
            maplesyrup: 5000,
            spamber: 1000,
            wood: 1400,
        },
        production: {
            amber: 10,
            spamber: 100,
            maplesyrup: 50,
        },
        totalProduced: {
            amber: 0,
            spamber: 0,
            maplesyrup: 0,
        },
        costScalingFunction:
            function () {
                this.cost["maplesyrup"] *= 1.3;
                this.cost["spamber"] *= 1.3;
                this.cost["wood"] *= 1.3;
            },
        quantity: 0,
    },
};

export { creatureConfigs };