// @ts-check

import { game } from "./main.js";

class News {
    constructor () {
        // Create stat div on left panel
        this.newsDiv = document.createElement("div");
        this.newsDiv.id = "news";
        var middlepanel = document.getElementById("middlepanel");
        middlepanel.appendChild(this.newsDiv);

        this.newsChoices = [
            "NEWS!!!",
            "news???",
            "There's a flower on that hill!",
            "Your cookies are quite popular in the neighborhood...  I mean, your <i>mahogany</i>",
        ];
        setInterval(this.showNews.bind(this), 1 * 1000);
    }

    showNews () {
        this.newsDiv.innerHTML = this.newsChoices[Math.floor(Math.random() * this.newsChoices.length)];
    }

    tick () {
        if (game.creatures.beaverine.quantity !== 0) {
            this.newsChoices.push("We're gonna need a bigger dam!");
        }
    }
}

function clearNews () {
    const middlepanel = document.getElementById("middlepanel");
    middlepanel.innerHTML = "";
}

export { clearNews, News };
