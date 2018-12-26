// @ts-check
import { Game } from "./Game.js";
import { notify } from "./Utils.js";

var game;

window.onload = function () {
    game = new Game();

    // If there's a save stored in localStorage, load it
    game.load();

    // Set up autosaving every 10 seconds
    // notify("Game saved") is in this function so that other calls to game.save() don't notify when not necessary
    // TODO: make a settings option for how long between saves
    setInterval(function (game) {game.save(); notify("Game saved"); }, 10 * 1000, game);


    // TODO: move to middle panel
    document.getElementById("hardReset").onclick = game.hardReset.bind(game, true);
    document.getElementById("export").onclick = game.exportSave.bind(game);
    document.getElementById("import").onclick = game.importSave.bind(game);

    document.getElementById("leftCanvas").addEventListener("click", game.click.bind(game), false);

    game.loop();

    window.addEventListener("blur", function () {
        Noty.closeAll();
    });

    window.addEventListener("focus", function () {
        Noty.closeAll();
    });

    window.addEventListener("keydown", function (e) { game.handleKey.call(game, e.key.toUpperCase()); });
};

export { game };
