// @ts-check
import { Game } from "./Game.js"

var game;

window.onload = function () {
  game = new Game();

  game.createCreatures();
  game.createUpgrades();

  document.
    getElementById("leftCanvas").
    addEventListener("click", game.click.bind(game), false);

  for (var i = 0; i < game.creatures.length; i++) {
    document.
      getElementById("" + i).
      addEventListener("click",
        function (i) {
          return function () {
            game.hireCreature(i);
          };
        }(i), false);
  }

  game.loop();
}

export { game };
