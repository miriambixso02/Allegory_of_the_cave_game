export default class Scena0_welcome extends Phaser.Scene {

  constructor() {
    super("welcome");
  }

  init() {
    this.game.gameState.lives = 3;
  }

  preload() {
    this.load.image("casa", "assets/images/background/home.png");
  }

  create() {
    this.background = this.add.image(0, 0, "casa");
    this.background.setOrigin(0, 0);

    // pulsante per giocare platform
    this.playButton = this.createButton(
      770,
      290,
      180,
      80,
      () => {
        this.scene.start("scena_1");
      }
    );

    // pulsante per passare alla storia
    this.storyButton = this.createButton(
      1052,
      403,
      175,
      70,
      () => { this.scene.start("story"); }
    );

    // pulsante per passare ai crediti
    this.creditsButton = this.createButton(
      1052,
      this.game.config.height * 2 / 3,
      175,
      70,
      () => { this.scene.start("credits"); }
    );
  }

  createButton(x, y, width, height, action) {
    const button = this.add.rectangle(x, y, width, height);

    button.setOrigin(0.5, 0.5);
    button.setInteractive();
    button.on("pointerdown", action);

    return button;
  }

  update() { }

  destroy() { }
}