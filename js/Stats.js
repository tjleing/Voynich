import { worldConfigs } from './configs/WorldConfigs.js';
import { resourceConfigs } from './configs/ResourceConfigs.js';
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
        for (const resourceType in resourceConfigs) {
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
        for (const world of this.game.worlds) {
            for (const resource of world.resources.resourceList) {
                const oldTickAdd = resource.tickAdd;
                resource.tickAdd = function (amount) {
                    stats.resourceCounts[this.internalName][0] += amount;
                    stats.resourceCounts[this.internalName][1] += amount;
                    oldTickAdd.call(this, amount);
                };
            }
        }
    }

    constructDOM () {
        if (this.statsDiv) {
            // Already constructed the HTML.
            return;
        }
        // TODO: think about how to actually do the DOM
        this.statsDiv = document.getElementById("stats");

        this.draw();
    }

    draw () {
        const d = new Date();
        this.statsDiv.innerHTML = `
        wood: ${fix(this.resourceCounts['wood'][0])} this run, ${fix(this.resourceCounts['wood'][1])} all time<br>
        you've been playing for: ${formatDuration((d.getTime() - this.runTime)/1000)}
        `;
    }

    // Reset stats pertaining to current ascension only
    startNewAsc () {
        for (const resourceType in resourceConfigs) {
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