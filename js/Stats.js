import { worldConfigs } from './configs/WorldConfigs.js';
import { worldResourceConfigs } from './configs/ResourceConfigs.js';
import { creatureConfigs } from './configs/CreatureConfigs.js';
import { fix, formatDuration } from './Utils.js';

class Stats {
    initialize (game) {
        this.game = game;

        // How many times you've chosen each type of world
        this.worldCounts = {};
        for (const worldType in worldConfigs) {
            this.worldCounts[worldType] = 0;
        }

        // How much of each resource you've accumulated all-time and this run
        this.resourceCounts = {};
        for (const resourceType in worldResourceConfigs) {
            this.resourceCounts[resourceType] = [0, 0];
        }

        // How many of each creature you've bought all-time and this run
        this.creatureCounts = {};
        for (const creatureType in creatureConfigs) {
            this.creatureCounts[creatureType] = [0, 0];
        }

        // Time started overall and time current ascention was started
        const d = new Date();
        this.runTime = d.getTime();
        this.ascTime = d.getTime();

        this.constructDOM();
        this.addWrappers();
    }

    addWrappers () {
        // My very own janky solution to the stats injection problem!
        // Just redefine the worlds' and resources' functions...
        for (const world of this.game.ascensions[0].worlds) {
            for (const resource of world.resources.list) {
                const oldTickAdd = resource.tickAdd;
                resource.tickAdd = function (amount) {
                    stats.resourceCounts[this.internalName][0] += amount;
                    stats.resourceCounts[this.internalName][1] += amount;
                    oldTickAdd.call(this, amount);
                };
            }

            for (const creature of world.creatures.list) {
                const oldBuy = creature.buy;
                creature.buy = function () {
                    stats.creatureCounts[this.internalName][0]++;
                    stats.creatureCounts[this.internalName][1]++;
                    oldBuy.call(this);
                }
                creature.buttonDiv.addEventListener("mouseup", creature.buy.bind(creature), false);
            }

            // Does this really belong in a function called "addWrappers"?
            // The idea is that you'd only call addWrappers when starting an asc
            // or loading, and if we're loading we immediately write over the
            // world counts with the save data, so it's fine
            this.worldCounts[world.name]++;
        }
    }

    constructDOM () {
        if (this.statsDiv) {
            // Already constructed the HTML.
            return;
        }
        this.statsDiv = document.getElementById("stats");

        this.draw();
    }

    draw () {
        const d = new Date();
        var content = `
        This ascension has lasted for ${formatDuration((d.getTime() - this.ascTime)/1000)}.<br>
        You've been playing for ${formatDuration((d.getTime() - this.runTime)/1000)}.  That's too long!<br><br>
        <u>World statistics:</u><br>`;
        for (const worldType in this.worldCounts) {
            if (this.worldCounts[worldType] !== 0) {
                content += `Created a ${worldType} world ${this.worldCounts[worldType]} times<br>`;
            }
        }

        content += "<br><u>Creature statistics:</u><br>";
        for (const creatureType in this.creatureCounts) {
            if (this.creatureCounts[creatureType][1] !== 0) {
                content += `Hired ${creatureConfigs[creatureType].displayNamePlural}: ${fix(this.creatureCounts[creatureType][0])} this run, ${fix(this.creatureCounts[creatureType][1])} all time<br>`;
            }
        }

        content += "<br><u>Resource statistics:</u><br>";
        for (const resourceType in this.resourceCounts) {
            if (this.resourceCounts[resourceType][1] !== 0) {
                content += `Collected ${worldResourceConfigs[resourceType].displayNamePlural}: ${fix(this.resourceCounts[resourceType][0])} this run, ${fix(this.resourceCounts[resourceType][1])} all time<br>`;
            }
        }

        this.statsDiv.innerHTML = content;
    }

    // Reset stats pertaining to current ascension only
    startNewAsc () {
        for (const resourceType in worldResourceConfigs) {
            this.resourceCounts[resourceType][0] = 0;
        }

        for (const creatureType in creatureConfigs) {
            this.creatureCounts[creatureType][0] = 0;
        }

        const d = new Date(); 
        this.ascTime = d.getTime();
        this.addWrappers();
    }

    save () {
        let save = {};
        save.wc = this.worldCounts;
        save.rc = this.resourceCounts;
        save.cc = this.creatureCounts;
        save.t  = [this.runTime, this.ascTime];

        return save;
    }

    load (save) {
        this.worldCounts    = save.wc;
        this.resourceCounts = save.rc;
        this.creatureCounts = save.cc;
        this.runTime        = save.t[0];
        this.ascTime        = save.t[1];
    }
}

const stats = new Stats();

export { stats };