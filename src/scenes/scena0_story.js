export default class Scena0_story extends Phaser.Scene {

  constructor() {
    super("story");
  }

  init() {
    this.slideIndex = 0;
    this.areNavButtonsVisible = true;
  }

  preload() {
    this.load.image("foto1", "./assets/images/background/scene_salienti/scena_saliente1.jpg");
    this.load.image("foto2", "./assets/images/background/scene_salienti/scena_saliente2.jpg");
    this.load.image("foto3", "./assets/images/background/scene_salienti/scena_saliente3.jpg");
    this.load.image("foto4", "./assets/images/background/scene_salienti/collegamento_platform.png");

    this.load.image("startGame", "./assets/images/UI/story/play_game.png");
    this.load.image("homeButtonStory", "./assets/images/UI/story/welcome_home.png");
    this.load.image("textButton", "./assets/images/UI/story/testo.png");
    this.load.image("slidePlus", "./assets/images/UI/story/avanti.png")
    this.load.image("slideMinus", "./assets/images/UI/story/indietro.png")
  }

  create() {
    // array che contiene le scene salienti
    this.bkg = [
      this.add.image(0, 0, "foto1"),
      this.add.image(0, 0, "foto2"),
      this.add.image(0, 0, "foto3"),
      this.add.image(0, 0, "foto4")
    ];

    for (let i = 0; i < this.bkg.length; i++) {
      this.bkg[i].setOrigin(0, 0).setVisible(false);
    }
    this.bkg[0].setVisible(true);

    // pulsante per tornare alla home
    this.homeButtonStory = this.createButton(
      70,
      57,
      "homeButtonStory",
      () => { this.scene.start("welcome"); }
    );

    // pulsante per aprire i testi
    this.textButton = this.createButton(
      this.game.config.width - 80,
      57,
      "textButton",
      () => {
        this.scene.pause();
        this.scene.launch("text_scene", { sceneName: "story", slideIndex: this.slideIndex });
      }
    );

    // pulsante per andare indietro
    this.slideMinus = this.createButton(
      this.game.config.width - 260,
      57,
      "slideMinus",
      () => { this.previous() }
    );

    // pulsante per andare avanti
    this.slidePlus = this.createButton(
      this.game.config.width - 170,
      57,
      "slidePlus",
      () => { this.next() }
    );

    // pulsante per andare avanti
    this.playButton = this.createButton(
      this.game.config.width / 2,
      480,
      "startGame",
      () => {
        this.scene.start("scena_1");
      }
    );
    this.playButton.setVisible(false);
  }

  createButton(x, y, texture, action) {
    const button = this.add.image(x, y, texture);

    button.setOrigin(0.5, 0.5);
    button.setInteractive();
    button.on("pointerdown", action);

    return button;
  }

  // manda la slide indietro mostrando l'immagine corretta
  previous() {
    if (this.slideIndex > 0) {
      this.bkg[this.slideIndex].setVisible(false);
      this.bkg[this.slideIndex - 1].setVisible(true);
      this.slideIndex -= 1;
    }
  }

  // manda slide avanti mostrando l'immagine corretta
  next() {
    if (this.slideIndex < this.bkg.length) {
      this.bkg[this.slideIndex].setVisible(false);
      this.bkg[this.slideIndex + 1].setVisible(true);
      this.slideIndex = this.slideIndex + 1;
    }
  }

  update() {
    this.slideMinus.setVisible(this.slideIndex >= 1);
    this.slidePlus.setVisible(this.slideIndex < 3);

    if (this.slideIndex === 3) {
      this.textButton.setVisible(false);
      this.playButton.setVisible(true);
    } else {
      this.textButton.setVisible(true);
      this.playButton.setVisible(false);
    }
  }
}