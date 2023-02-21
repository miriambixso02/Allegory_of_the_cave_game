export default class Scena0_pause extends Phaser.Scene {

  parentSceneName;
  constructor() {
    super("pause_scene");
  };

  init(data) {
    this.parentSceneName = data.sceneName;
  }

  preload() {
    this.load.image("sfondoPausa", "./assets/images/UI/pausa/pausa_panel.png");
    this.load.image("continueButton", "./assets/images/UI/pausa/play.png");
    this.load.image("resetButton", "./assets/images/UI/pausa/reset.png");
    this.load.image("homeButtonPause", "./assets/images/UI/pausa/home.png");
  }

  create() {
    this.pausePanel = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "sfondoPausa");
    this.pausePanel.setOrigin(0.5, 0.5);
    this.pausePanel.setInteractive();

    // pulsante per continuare a giocare
    this.continueButton = this.createButton(
      this.game.config.width / 2,
      320,
      "continueButton",
      () => {
        this.scene.stop();
        this.scene.resume(this.parentSceneName);
      }
    );

    // pulsante per ricominciare il livello (reset delle vite)
    this.resetButton = this.createButton(
      440,
      460,
      "resetButton",
      () => {
        this.scene.stop();
        this.scene.start(this.parentSceneName);
      }
    );

    // pulsante per tornare alla home (reset delle vite)
    this.homeButtonPause = this.createButton(
      840,
      460,
      "homeButtonPause",
      () => {
        this.scene.stop(this.parentSceneName);
        this.scene.start("welcome");
        this.scene.stop();
      }
    );
  }

  createButton(x, y, texture, action) {
    const button = this.add.image(x, y, texture);

    button.setOrigin(0.5, 0.5);
    button.setInteractive();
    button.on("pointerdown", action);

    return button;
  }

  update() { }

  destroy() { }
}