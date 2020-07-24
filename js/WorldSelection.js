// @ts-check

import { worldConfigs } from "./configs/WorldConfigs.js";

class WorldSelection {
    constructor (div, worldCount = 2) {
        this.div = div;
        this.worldCount = worldCount;
        this.typeSelects = [];
        this.difficultySelects = [];

        this.constructDOM();
    }
    
    initialize (typeSelectIndices, difficultySelectIndices) {
        let i = 0;
        for (const typeSelect of this.typeSelects) {
            typeSelect.selectedIndex = typeSelectIndices[i];
            i++;
        }
        i = 0;
        for (const difficultySelect of this.difficultySelects) {
            difficultySelect.selectedIndex = difficultySelectIndices[i];
            i++;
        }
    }

    constructDOM () {
        for (let i = 0; i<this.worldCount; ++i) {
            const selectDiv = document.createElement("div");
            selectDiv.classList.add("worldSelect");

            const typeSelect = document.createElement("select");
            for (const worldName in worldConfigs) {
                const option = document.createElement("option");
                option.text = worldName;
                typeSelect.appendChild(option);
            }
            typeSelect.selectedIndex = 1;
            this.typeSelects.push(typeSelect);
            selectDiv.appendChild(typeSelect);

            const difficultySelect = document.createElement("select");
            for (let j = 1; j<=10; ++j) {
                const option = document.createElement("option");
                option.text = j.toString();
                difficultySelect.appendChild(option);
            }
            this.difficultySelects.push(difficultySelect);
            selectDiv.appendChild(difficultySelect);

            this.div.append(selectDiv);
        }
    }

    save () {
        const save = {};
        
        save.t = this.typeSelects.map(select => select.selectedIndex);
        save.d = this.difficultySelects.map(select => select.selectedIndex);
        save.c = this.worldCount;

        return save;
    }
}


function createWorldSelection (div) {
    const worldSelection = new WorldSelection(div);
    return worldSelection;
}

function loadWorldSelection (save, div) {
    const worldSelection = new WorldSelection(div, save.c);
    worldSelection.initialize(save.t, save.d);
    return worldSelection;
}

export { createWorldSelection, loadWorldSelection };
