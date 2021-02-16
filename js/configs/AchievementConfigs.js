import { Achievement } from "../Achievement.js";

let createAchievements = function (game) {
    const achievements = [];
    achievements.push(
        new Achievement(
            {
                displayName: "We'll seal you later!",
                lockedFlavorText: "Hmm... maybe there's a creature with a name like that",
                unlockedFlavorText: "In fact, we'll seal you now!",
                unlockCondition: () => {
                    for (const ascension of game.ascensions) {
                        for (const world of ascension.worlds) {
                            if ("weaseal" in world.creatures && world.creatures.weaseal.quantity >= 1)
                                return true;
                        }
                    }
                    return false;
                },
                effect: () => { },
            }
        )
    );
    achievements.push(
        new Achievement(
            {
                displayName: "The smallest e",
                lockedFlavorText: "Is this one a pun too?",
                unlockedFlavorText: "Lil' e, sounds like a rapper!  Shucks that was terrible",
                unlockCondition: () => {
                    for (const ascension of game.ascensions) {
                        for (const world of ascension.worlds) {
                            if ("flowers" in world.resources && world.resources.flowers.amount >= 1)
                                return true;
                        }
                    }
                    return false;
                },
                effect: () => {
                    // TODO: yeah hardcoded world indices aren't great,
                    // but achievements giving resources is pretty bad too
                    //game.ascensions[0].worlds[0].resources.flowers.amount += 5;
                },
            }
        )
    );
    achievements.push(
        new Achievement(
            {
                displayName: "Mmmm, steak sauce",
                lockedFlavorText: "Smells prestigous... you could say it's known for its excellence",
                unlockedFlavorText: "Yes our naming scheme is terrible, who even came up with 'A1,' seriously",
                unlockCondition: () => {
                    for (const ascension of game.ascensions) {
                        for (const world of ascension.worlds) {
                            if (world.okraGain > 0)
                                return true;
                        }
                    }
                    return false;
                },
                effect: () => { },
            }
        )
    );

    return achievements;
}

export { createAchievements };