const worldUpgradeConfigs = {
    "twoForOne": {
        internalName: "twoForOne",
        displayName: "Two for one deal!",
        flavorText: "Everything gets cheaper?",
        cost: {
            berries: 100,
            wood: 100,
        },
        purchased: false,
        effect: function () {
            for (const creature of this.world.creatures.creatureList) {
                for (const resource in creature.cost) {
                    creature.cost[resource] *= 0.5;
                }
            }
            for (const upgrade of this.world.upgrades.upgradeList) {
                for (const resource in upgrade.cost) {
                    upgrade.cost[resource] *= 0.5;
                }
            }
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 10);
        },
    },
    "BeaverineUp1": {
        internalName: "BeaverineUp1",
        displayName: "Better dams",
        flavorText: "Shucks, none of those ideas are good",
        cost: {
            berries: 1000,
            wood: 1000,
        },
        purchased: false,
        effect: function () {
            this.world.creatures.beaverine.production["wood"] *= 3;
        },
        unlockCondition: function () {
            var sum = 0;
            for (const creature of this.world.creatures.creatureList) {
                sum += creature.quantity;
            }
            return (sum >= 10);
        },
    },
    "everythingIsAwful": {
        internalName: "everythingIsAwful",
        displayName: "Why would you do this?",
        flavorText: "Makes everything do nothing",
        cost: {
            berries: 10,
            wood: 10,
        },
        purchased: false,
        effect: function () {
            for (const creature of this.world.creatures.creatureList) {
                creature.production["wood"] *= 0.001;
                creature.production["berries"] *= 0.001;
            }
        },
        unlockCondition: function () {
            return (this.world.creatures.beaverine.quantity > 0);
        },
    },
    "undoAwful": {
        internalName: "undoAwful",
        displayName: "You shouldn't have done that",
        flavorText: "Fixes your mistakes",
        cost: {
            berries: 100,
            wood: 100,
        },
        purchased: false,
        effect: function () {
            for (const creature of this.world.creatures.creatureList) {
                creature.production["wood"] /= 0.001;
                creature.production["berries"] /= 0.001;
            }
        },
        unlockCondition: function () {
            return (this.world.upgrades["everythingIsAwful"].purchased);
        },
    },
    "greyBG": {
        internalName: "greyBG",
        displayName: "More depressing",
        flavorText: "Yum! Makes the game more depressing",
        cost: {
            berries: 0,
            wood: 0,
            flowers: 0,
        },
        purchased: false,
        effect: function () {
            settings.bgColor = "#888888";
        },
        unlockCondition: function () {
            for (const creature of this.world.creatures.creatureList) {
                if (creature.quantity >= 13) return true;
            }
            return false;
        },
    },
    "getPtroed": {
        internalName: "getPtroed",
        displayName: "Skip the whole game",
        flavorText: "This one's on the hill!",
        cost: {
            flowers: 1,
        },
        purchased: false,
        effect: function () {
            this.world.creatures.ptrocanfer.quantity++;
        },
        unlockCondition: function () {
            for (const creature of this.world.creatures.creatureList) {
                if (creature.quantity > 0) return false;
            }
            return true;
        },
    },
    "doubleFocusPower": {
        internalName: "doubleFocusPower",
        displayName: "Self-immolation",
        flavorText: "You're on fire! ... Doubles the rate at which you gain resources yourself.",
        cost: {
            berries: 10000,
            wood: 10000,
        },
        purchased: false,
        effect: function () {
            this.focusPower *= 2;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 1000);
        },
    },


    // World prestige upgrades (hopefully temporary)
    // TODO: prestige rework, remove all these plz
    "lushOkra0": {
        internalName: "lushOkra0",
        displayName: "Lush okra piece #0",
        flavorText: "I'll be honest, this one is just for testing the game more easily",
        cost: {
            wood: 0,
        },
        purchased: false,
        effect: function () {
            // TODO: v hardcoded rn
            this.world.okraGain += 1;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 0);
        }
    },
    "lushOkra1": {
        internalName: "lushOkra1",
        displayName: "Lush okra piece #1",
        flavorText: "Your trip to the lush biome has not been in vain!",
        cost: {
            wood: 0,
        },
        purchased: false,
        effect: function () {
            // TODO: v hardcoded rn
            this.world.okraGain += 1;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 10000 && this.world.resources.flowers.amount >= 1000);
        }
    },
    "lushOkra2": {
        internalName: "lushOkra2",
        displayName: "Lush okra piece #2",
        flavorText: "Two pieces of okra here?  That's overpowered, seriously",
        cost: {
            wood: 0,
        },
        purchased: false,
        effect: function () {
            // TODO: v hardcoded rn
            this.world.okraGain += 1;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 30000 && this.world.resources.flowers.amount >= 3000);
        }
    },
    "woodedOkra1": {
        internalName: "woodedOkra1",
        displayName: "Wooded okra piece #1",
        flavorText: "Your trip to the wooded biome has not been in vain!",
        cost: {
            wood: 0,
        },
        purchased: false,
        effect: function () {
            // TODO: v hardcoded rn
            this.world.okraGain += 1;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 5000 && this.world.resources.amber.amount >= 1000);
        }
    },
    "woodedOkra2": {
        internalName: "woodedOkra2",
        displayName: "Wooded okra piece #2",
        flavorText: "Shucks I guess this is the end of the game huh",
        cost: {
            wood: 0,
        },
        purchased: false,
        effect: function () {
            // TODO: v hardcoded rn
            this.world.okraGain += 1;
        },
        unlockCondition: function () {
            return (this.world.resources.wood.amount >= 10000 && this.world.resources.amber.amount >= 10000);
        }
    },
};

const ascensionUpgradeConfigs = {};

export { worldUpgradeConfigs, ascensionUpgradeConfigs };