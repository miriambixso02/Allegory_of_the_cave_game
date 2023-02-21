import Scena0_welcome from "./scenes/scena0_welcome.js";
import Scena0_credits from "./scenes/scena0_credits.js";
import Scena0_story from "./scenes/scena0_story.js";
import Scena0_pause from "./scenes/scena0_pausa.js";
import Scena0_testi from "./scenes/scena0_testi.js";
import Scena1 from "./scenes/scena1_tutorial.js";
import Scena2 from "./scenes/scena2_grattacieli.js";
import Scena3 from "./scenes/scena3_grattacieli.js";

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: 0x000000,
  scene: [
    Scena0_welcome,
    Scena0_credits,
    Scena0_story,
    Scena1,
    Scena2,
    Scena3,
    Scena0_pause,
    Scena0_testi,
  ],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 300,
      },
      debug: false,
    }
  },
  autoCenter: true
};

const game = new Phaser.Game(config);

game.gameState = {
  lives: 3,
}

game.scene.start("welcome");