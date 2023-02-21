export default class Scena0_credits extends Phaser.Scene {

  constructor() {
    super("credits");
  }

  preload() {
    this.load.image("crediti", "./assets/images/background/crediti.png");

    this.load.image("backButton", "./assets/images/UI/story/welcome_home.png");
  }

  create() {
    this.background = this.add.image(0.5, 0.4, "crediti");
    this.background.setOrigin(0, 0);

    // pulsante per tornare alla home
    this.backButton = this.add.image(70, 57, "backButton");
    this.backButton.setOrigin(0.5, 0.5);
    this.backButton.setInteractive();

    this.backButton.on("pointerdown", () => { this.scene.start("welcome"); });
  }

  update() { }

  destroy() { }
}