export default class Scena0_testi extends Phaser.Scene {

  sceneName;
  constructor() {
    super("text_scene");
  };

  init(data) {
    this.sceneName = data.sceneName;
    this.slideIndex = data.slideIndex;

    // array che contengono dialoghi con Platone e Impiegato
    this.dialogoPlatone = [];
    this.dialogoImpiegato = [];
    this.battuta = 0;

    this.badEnding = this.add.image(0, 0, "").setVisible(false);

    // tasti per mandare avanti i dialoghi e prendere scelte
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    this.input.keyboard.enabled = true;
  }

  preload() {
    // testi delle scene salienti
    this.load.image("testo1", "./assets/images/testi/scene_salienti/testo1.png");
    this.load.image("testo2", "./assets/images/testi/scene_salienti/testo2.png");
    this.load.image("testo3", "./assets/images/testi/scene_salienti/testo3.png");

    // battute di Platone e protagonista
    this.load.image("battuta1", "./assets/images/testi/dialogues/platone/platone1.png");
    this.load.image("battuta2", "./assets/images/testi/dialogues/platone/platone2.png");
    this.load.image("battuta3", "./assets/images/testi/dialogues/platone/platone3.png");
    this.load.image("battuta4", "./assets/images/testi/dialogues/platone/platone4.png");
    this.load.image("battuta5", "./assets/images/testi/dialogues/platone/platone5.png");
    this.load.image("battuta6", "./assets/images/testi/dialogues/platone/platone6.png");

    // battute dell'impiegato e protagonista
    this.load.image("impiegato1", "./assets/images/testi/dialogues/impiegato/impiegato1.png");
    this.load.image("impiegato2", "./assets/images/testi/dialogues/impiegato/impiegato2.png");
    this.load.image("impiegato3", "./assets/images/testi/dialogues/impiegato/impiegato3.png");
    this.load.image("impiegato4", "./assets/images/testi/dialogues/impiegato/impiegato4.png");

    // fogli
    this.load.image("etichetta", "./assets/images/testi/oggetti/platone_adress.png");
    this.load.image("foglioTopi", "./assets/images/testi/oggetti/foglio_topi.png");
    this.load.image("foglioChiave", "./assets/images/testi/oggetti/foglio_chiave.png");

    // pulsanti di navigazione
    this.load.image("close", "./assets/images/UI/chiudi.png");
    this.load.image("noHome", "./assets/images/UI/story/testi/no_welcome_home.png");
    this.load.image("noPlusSlide", "./assets/images/UI/story/testi/no_avanti.png");
    this.load.image("noMinusSlide", "./assets/images/UI/story/testi/no_indietro.png");

    // bad ending
    this.load.image("badEnding", "./assets/images/background/scene_salienti/bad_ending.jpg");
  }

  create() {
    // a seconda della scena da cui si proviene vengono creati gli elementi necessari
    switch (this.sceneName) {
      case "story": {
        this.storyPanel();
        if (this.slideIndex === 0) {
          this.firstStory();
        }
        else if (this.slideIndex === 1) {
          this.secondStory();
        }
        else {
          this.thirdStory();
        }
        break;
      }
      case "scena_1": {
        if (this.slideIndex == 0) {
          this.foglio("etichetta");
        } else {
          this.platoSpeech();
        }
        break;
      }
      case "scena_2": {
        if (this.slideIndex == 0) {
          this.workerSpeech();
        } else if (this.slideIndex == 1) {
          this.foglio("foglioTopi");
        } else {
          this.foglio("foglioChiave");
        }
        break;
      }
      default: console.log("qualcosa non va");
    }
  }

  storyPanel() {
    this.textPanel = this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 900, 500, 0XFFFFFF, 0.9);
    this.textButton = this.add.image(this.game.config.width - 80, 57, "close");
    this.textButton.setOrigin(0.5, 0.5);
    this.textButton.setInteractive();

    const noActiveNavButtons = [
      this.add.image(70, 57, "noHome"),
      this.add.image(this.game.config.width - 170, 57, "noPlusSlide"),
    ];

    this.textButton.on("pointerdown", () => {
      this.scene.resume(this.sceneName);
      this.scene.stop();
    });
  }

  firstStory() {
    this.testo1 = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "testo1");
    this.testo1.setOrigin(0.5, 0.5);
  }

  secondStory() {
    this.testo2 = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "testo2");
    this.testo2.setOrigin(0.5, 0.5);
    this.noMinusSlide = this.add.image(this.game.config.width - 260, 57, "noMinusSlide");
  }

  thirdStory() {
    this.testo3 = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "testo3");
    this.testo3.setOrigin(0.5, 0.5);
    this.noMinusSlide = this.add.image(this.game.config.width - 260, 57, "noMinusSlide");
  }

  // diverse tipologie di foglietti: cambia la texture in base al parametro passato
  foglio(textureName) {
    this.add.image(this.game.config.width / 2, this.game.config.height / 2, textureName)

    this.textButton = this.add.image(this.game.config.width - 250, 100, "close");
    this.textButton.setOrigin(0.5, 0.5).setInteractive();

    this.textButton.on("pointerdown", () => {
      this.scene.resume(this.sceneName);
      this.scene.stop();
    });

    // per non staccare la mano dalla tastiera
    this.input.keyboard.on("keydown", (event) => {
      this.input.keyboard.enabled = false;
      if (event.key === "x") {
        this.scene.resume(this.sceneName);
        this.scene.stop();
      } this.input.keyboard.enabled = true;
    });
  }

  // dialogo con Platone
  platoSpeech() {
    // tutti i testi contenenti le battute
    const b1 = "battuta1";
    const b2 = "battuta2";
    const b3 = "battuta3";
    const b4 = "battuta4";
    const b5 = "battuta5";
    const b6 = "battuta6";

    const testi = [b1, b2, b3, b4, b5, b6];

    for (let i = 0; i < 6; i++) {
      const testiPlato = this.add.image(this.game.config.width / 2, 25, testi[i]).setOrigin(0.5, 0).setVisible(false);
      this.dialogoPlatone.push(testiPlato);
    }

    this.badEnding = this.add.image(0, 0, "badEnding").setOrigin(0, 0).setVisible(false);

    this.dialogoPlatone[0].setVisible(true);
    this.battuta = 0;

    // quando viene premuto un tasto della tastiera
    this.input.keyboard.on("keydown", (event) => {
      this.input.keyboard.enabled = false;

      // se la battuta è dispari, cioè parla il protagonista, vi è la possibilità di premere "x" o "z"
      if (event.key === "x" || (event.key === "z" && this.battuta % 2 === 1)) {
        if (this.battuta <= 4) {
          // nascondi testo corrente e mostra quello successivo
          this.dialogoPlatone[this.battuta].setVisible(false);
          this.dialogoPlatone[this.battuta + 1].setVisible(true);
          this.battuta += 1;
        } else {
          // nel caso in cui la battuta è quella finale cambia la situazione in base alla risposta data
          if (this.keyX.isDown) {
            // se si preme il tasto x, si sceglie la risposta più negativa, per cui si finisce nella bad ending
            this.badEnding.setVisible(true);
            this.time.delayedCall(4500, () => {
              this.scene.stop(this.sceneName);
              this.scene.start("welcome");
              this.scene.stop();
            }, null, this);
          }
          if (this.keyZ.isDown) {
            // se si preme il tasto y, si sceglie la risposta più positiva, per cui si inizia a giocare
            this.scene.stop(this.sceneName);
            this.scene.start("scena_2");
            this.scene.stop();
          }
        }
      }

      this.input.keyboard.enabled = true;
    });
  }

  // dialogo con l'impiegato
  workerSpeech() {
    // tutti i testi contenenti le battute
    const b1 = "impiegato1";
    const b2 = "impiegato2";
    const b3 = "impiegato3";
    const b4 = "impiegato4";

    const testi = [b1, b2, b3, b4];

    for (let i = 0; i < 6; i++) {
      const testiPlato = this.add.image(this.game.config.width / 2, 25, testi[i]).setOrigin(0.5, 0).setVisible(false);
      this.dialogoImpiegato.push(testiPlato);
    }

    this.dialogoImpiegato[0].setVisible(true);
    this.battuta = 0;

    // quando viene premuto un tasto della tastiera
    this.input.keyboard.on("keydown", (event) => {
      this.input.keyboard.enabled = false;

      if ((event.key === "x" && this.battuta <= 2) || (event.key === "z" && this.battuta === 3)) {
        if (this.battuta <= 2) {
          // nascondi testo corrente e mostra quello successivo
          this.dialogoImpiegato[this.battuta].setVisible(false);
          this.dialogoImpiegato[this.battuta + 1].setVisible(true);
          this.battuta += 1;
        } else if (this.battuta == 3) {
          // nel caso in cui la battuta è quella finale
          this.scene.stop();
          this.scene.resume(this.sceneName);
        }
      }

      this.input.keyboard.enabled = true;
    });
  }

  update() {
    if (this.badEnding.visible) {
      this.input.keyboard.enabled = false;
    }
  }

  destroy() { }
}