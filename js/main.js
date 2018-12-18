// @ts-check
import { Game } from "./Game.js";

var game;

window.onload = function () {
  game = new Game();

  game.createResources();
  game.createCreatures();
  game.createUpgrades();

  // If there's a save stored in localStorage, load it
  game.load();
  // Set up autosaving every five seconds
  // TODO: make a settings option for how long between saves
  setInterval(function (game) {game.save();}, 5 * 1000, game);

  document.
    getElementById("leftCanvas").
    addEventListener("click", game.click.bind(game), false);

  game.loop();
};

export { game };
