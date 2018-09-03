// @ts-check
import { Game } from "./Game.js"

var game;

window.onload = function () {
  game = new Game();

  game.createResources();
  game.createCreatures();
  game.createUpgrades();

  document.
    getElementById("leftCanvas").
    addEventListener("click", game.click.bind(game), false);

  game.loop();
}

export { game };
