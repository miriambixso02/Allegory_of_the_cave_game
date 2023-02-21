import Player from "../components/player.js";
import Platform from "../components/platforms/staticPlatform.js";
import AnimatedElements from "../components/animatedElements.js";

import { handleOverlapping } from '../utils.js'
import { handleContaining } from '../utils.js'

export default class Scena1 extends Phaser.Scene {

  constructor() {
    super("scena_1");
  }

  init() {
    this.floorHeight = this.game.config.height - 20;
    this.sceneWidth = 4470;
    this.startX = 400;
    this.startY = 935;
    this.isPlayerMovable = true;

    this.talk = false; // variabile che indica se posso parlare con npc
    this.whoTalks; // se è 0 indica il pacco, se 1 indica Platone
    this.hasPackage = false;

    // tasto per aprire le interazioni
    this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
  }

  preload() {
    this.load.image("background", "./assets/images/background/sfondi_livello/mappa1.png");

    this.load.image("floor", "./assets/images/environment/scena_1/piattaforme/floor_tutorial.png");

    // cartelli con istruzioni
    this.load.image("muoversi", "./assets/images/environment/scena_1/cartelli/muoversi.png");
    this.load.image("interazione", "./assets/images/environment/scena_1/cartelli/interazione.png");
    this.load.image("saltare", "./assets/images/environment/scena_1/cartelli/saltare.png");
    this.load.image("abbassarsi", "./assets/images/environment/scena_1/cartelli/abbassarsi.png");
    this.load.image("metterePausa", "./assets/images/environment/scena_1/cartelli/mettere_in_pausa.png");

    // piattaforme
    this.load.image("bidone", "./assets/images/environment/scena_1/piattaforme/bidone.png");
    this.load.image("muretto", "./assets/images/environment/scena_1/piattaforme/muretto.png");
    this.load.image("balconcino", "./assets/images/environment/scena_1/piattaforme/balconcino.png");
    this.load.image("palazzone", "./assets/images/environment/scena_1/piattaforme/palazzo_tutorial.png");

    // icone di interazione
    this.load.image("readInteraction", "./assets/images/UI/lente.png");
    this.load.image("talkInteraction", "./assets/images/UI/dialogo.png");
    // oggetti/npc interagibili
    this.load.image("platone", "./assets/images/collectibles/chiave_oggetto.png");
    this.load.image("pacco", "./assets/images/collectibles/pacco.png");

    // cespuglio in overlay
    this.load.image("cespuglio", "./assets/images/environment/scena_1/cespuglio.png");

    // giocatore
    this.load.spritesheet("playerMovements", "./assets/images/characters/player_movements.png", {
      frameWidth: 117,
      frameHeight: 125,
    });
    // Platone
    this.load.spritesheet("platoMovements", "./assets/images/characters/plato_movements.png", {
      frameWidth: 100,
      frameHeight: 137,
    });

    // HUD
    this.load.image("paccoUI", "./assets/images/UI/HUD/pacco_UI.png");
  }

  create() {
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0).setScrollFactor(1, 1);

    this.createSigns();

    // giocatore
    this.player = new Player(this, this.startX, this.startY, this.sceneWidth);

    // NPC e foglietti interattivi
    this.createInteractions();

    // cespuglio in overlay
    this.cespuglio1 = this.add.image(4400, this.floorHeight + 250, "cespuglio").setOrigin(0, 1).setFlipX(true);
    this.cespuglio2 = this.add.image(3933, this.floorHeight + 250, "cespuglio").setOrigin(0, 1);

    // piattaforme
    this.createPlatform();
    // overlay per rimanere sotto al palazzo
    this.elementsInOverlay()

    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.followOffset.set(-300, 0);

    // HUD della scena
    this.createUI();
  }

  createSigns() {
    this.cartelli = [
      this.add.image(500, this.floorHeight + 270, "muoversi"),
      this.add.image(1000, this.floorHeight + 250, "interazione"),
      this.add.image(1400, this.floorHeight + 250, "saltare"),
      this.add.image(3000, this.floorHeight + 370, "metterePausa")
    ];

    for (const cartelli of this.cartelli) {
      cartelli.setOrigin(0, 1);
    }
  }

  createInteractions() {
    // pacco all'inizio del gioco
    this.pacco = this.add.image(1100, this.floorHeight + 247, "pacco").setOrigin(0.5, 1);
    this.physics.add.existing(this.pacco);
    this.pacco.body.setSize(100, 100).setOffset(-25, -55);
    // simbolo per indicare che si può leggere
    this.interactiveRead = this.add.image(this.pacco.x - 30, this.pacco.y - 70, "readInteraction");
    this.interactiveRead.setVisible(false);

    // quando player overlap pacco compare immagine che mostra che è interagibile
    this.physics.add.overlap(this.player, this.pacco, () => {
      this.whoTalks = 0;
      this.paccoToSee();
    }, null, this);

    // dialogo con Platone
    this.platone = new AnimatedElements(this, 3700, 950, "platoMovements");
    // simbolo per indicare che si può parlare
    this.interactiveTalk = this.add.image(this.platone.x - 10, this.platone.y - 152, "talkInteraction");
    this.interactiveTalk.setFlip(true).setVisible(false);

    // quando player overlap PLatone compare immagine che mostra che è interagibile
    this.physics.add.overlap(this.player, this.platone, () => {
      if (this.hasPackage) {
        this.whoTalks = 1;
        this.talkToPlato();
      }
    }, null, this);
  }

  createPlatform() {
    const elementsToCollide = [this.player, this.pacco, this.platone];

    const piattaforme = [
      new Platform(this, { x: 1420, y: this.floorHeight + 152 }, "bidone", [this.player]), // bidone1
      new Platform(this, { x: 1600, y: this.floorHeight + 15 }, "muretto", [this.player]), // muretto1
      new Platform(this, { x: 1650, y: this.floorHeight + 152 }, "bidone", [this.player]).setFlipX(true), // bidone2
      new Platform(this, { x: 2600, y: this.floorHeight + 152 }, "bidone", [this.player]), // bidone3
      new Platform(this, { x: 2753, y: this.floorHeight - 5 }, "balconcino", [this.player]), // piattaforma per vedere cartello pausa
      new Platform(this, { x: 1990, y: 205 }, "palazzone", [this.player]),
    ];

    // pavimento
    this.floor = this.add.tileSprite(0, this.floorHeight + 247, 1172 * 4, 306, "floor").setOrigin(0, 0);
    this.physics.add.existing(this.floor);
    this.floor.body.setImmovable(true).setOffset(0, 5);
    this.floor.body.allowGravity = false;
    elementsToCollide.forEach(elem => this.physics.add.collider(elem, this.floor));
  }

  elementsInOverlay() {
    // overlap trasparente per rimanere abbassato sotto al tetto edificio rotto
    this.underCeiling = this.add.rectangle(2190, this.floorHeight + 280, 510, 200, 0XFFFFFF, 0);
    this.underCeiling.setOrigin(0.5, 1);
    this.physics.add.existing(this.underCeiling);
    this.underCeiling.body.setImmovable(true).allowGravity = false;

    this.cartelloPalazzo = this.add.image(2019, 813, "abbassarsi").setOrigin(0, 1);
  }

  createUI() {
    // pacco preso
    this.paccoUI = this.add.image(50, 55, "paccoUI").setVisible(false).setScrollFactor(0, 0);
  }

  paccoToSee() {
    if (this.keyX.isDown) {
      this.scene.pause();
      this.scene.launch("text_scene", { sceneName: "scena_1", slideIndex: this.whoTalks });
      this.paccoUI.setVisible(true);
      this.pacco.destroy();
      this.interactiveRead.destroy();
      this.hasPackage = true;
    }
  }

  talkToPlato() {
    if (this.keyX.isDown) {
      this.paccoUI.setVisible(false);
      this.scene.pause();
      this.scene.launch("text_scene", { sceneName: "scena_1", slideIndex: this.whoTalks });
    }
  }

  update() {
    this.player.moveManagement(this.isPlayerMovable);
    this.platone.manageAnimations();

    handleOverlapping(
      this.player,
      this.pacco,
      () => { this.interactiveRead.setVisible(true); },
      () => { this.interactiveRead.setVisible(false); }
    );
    handleOverlapping(
      this.player,
      this.platone,
      () => { this.interactiveTalk.setVisible(true && this.hasPackage); },
      () => { this.interactiveTalk.setVisible(false); }
    );

    // per evitare che venga eseguito sempre nella scena
    if (this.player.x < 2600) {
      // ccontrollare se giocatore è sotto alla piattaforma bassa
      handleContaining(
        this.underCeiling,
        this.player,
        () => this.player.updateUnder(true),
        () => this.player.updateUnder(false)
      );
    }

    // npc segue protagonista con lo sguardo
    if (this.player.x > this.platone.x) {
      this.platone.setFlipX(true);
    } else {
      this.platone.setFlipX(false);
    }

    // menù di pausa
    if (this.player.keyPause.isDown) {
      this.scene.pause();
      this.scene.launch("pause_scene", { sceneName: "scena_1" });
    }
  }

  destroy() { }
}