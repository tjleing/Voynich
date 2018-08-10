// @ts-check
import { Game } from "./Game.js"

var game;

window.onload = function () {
  game = new Game();

  game.createBuildings();

  document.
    getElementById("leftCanvas").
    addEventListener("click", game.click.bind(game), false);

  for (var i = 0; i < game.buildings.length; i++) {
    document.
      getElementById("" + i).
      addEventListener("click",
        function (i) {
          return function () {
            game.buyBuilding(i);
          };
        }(i), false);
  }

  game.loop();
}

export { game };