import Player from "../components/player.js";
import Platform from "../components/platforms/staticPlatform.js";
import ElevatorPlatform from "../components/platforms/elevatorPlatform.js";
import MovingPlatform from "../components/platforms/movingPlatform.js";
import BouncingPlatform from "../components/platforms/bouncingPlatform.js";
import BreakablePlatforms from "../components/platforms/breakablePlatform.js";
import Enemy from "../components/enemies.js";
import Porta from "../components/door.js";
import Cassa from "../components/cassa.js";
import Key from "../components/keys.js";
import Grata from "../components/grata.js";
import Checkpoint from "../components/checkpoint.js";
import AnimatedElements from "../components/animatedElements.js";

import { handleContaining } from '../utils.js'

export default class Scena3 extends Phaser.Scene {

  constructor() {
    super("scena_3");
  }

  init() {
    this.floorHeight = this.game.config.height - 300;
    this.sceneWidth = 8650;
    this.startX = 185;
    this.startY = 510;
    this.isPlayerMovable = true;
    this.nuvole = [];
    this.tralicci = []; // alcuni elementi che provocano danno quando si collide con essi

    // checkpoints
    this.checkpoints = [];
    this.takenId;

    // piattaforme che si rompono
    this.breakablePlatforms = [];

    // cuori della vita
    this.hearts = [];
    this.game.gameState.lives = 3;
  }

  preload() {
    this.load.image("background3", "./assets/images/background/sfondi_livello/mappa3.png");
    // scene dell'ending
    this.load.image("salaControllo", "./assets/images/background/scene_salienti/scena_saliente2.jpg");
    this.load.image("parcoScene", "./assets/images/background/scene_salienti/scena_saliente3.jpg");
    this.load.image("goodEnding", "./assets/images/background/scene_salienti/good_ending.jpg");

    // immagini piattaforme
    this.load.image("pInizio", "./assets/images/environment/scena_3/piattaforme/statiche/p1_3.png");
    this.load.image("ringhieraInizio", "./assets/images/environment/scena_3/piattaforme/statiche/ringhiera_inizio.png");
    this.load.image("pCamino", "./assets/images/environment/scena_3/piattaforme/statiche/p2_3.png");
    this.load.image("camino1", "./assets/images/environment/scena_3/piattaforme/statiche/camino_1.png");
    this.load.image("pEdificioChiave", "./assets/images/environment/scena_3/piattaforme/statiche/p3_3.png");
    this.load.image("asseChiave", "./assets/images/environment/scena_3/piattaforme/statiche/asse_chiave.png");
    this.load.image("asse2", "./assets/images/environment/scena_3/piattaforme/statiche/asse_2.png");
    this.load.image("asse3", "./assets/images/environment/scena_3/piattaforme/statiche/asse_3.png");
    this.load.image("p4a", "./assets/images/environment/scena_3/piattaforme/statiche/p4a_3.png");
    this.load.image("p4b", "./assets/images/environment/scena_3/piattaforme/statiche/p4b_3.png");
    this.load.image("pEdificioTopi", "./assets/images/environment/scena_3/piattaforme/statiche/p5_3.png");
    this.load.image("asseTopi", "./assets/images/environment/scena_3/piattaforme/statiche/piattaforma_topi_lunga.png");
    this.load.image("scalino1", "./assets/images/environment/scena_3/piattaforme/statiche/scalino_1.png");
    this.load.image("scalino2", "./assets/images/environment/scena_3/piattaforme/statiche/scalino_2.png");
    this.load.image("balconcinoTopi", "./assets/images/environment/scena_3/piattaforme/statiche/balconcino_topi.png");
    this.load.image("pCassa", "./assets/images/environment/scena_3/piattaforme/statiche/p_cassa.png");
    this.load.image("camino2", "./assets/images/environment/scena_3/piattaforme/statiche/camino_2.png");
    this.load.image("pFinale", "./assets/images/environment/scena_3/piattaforme/statiche/p_finale.png");

    // tetti e architravi
    this.load.image("tettoInizio", "./assets/images/environment/scena_3/tetti/tetto_inizio.png");
    this.load.image("tettoChiave", "./assets/images/environment/scena_3/tetti/tetto_chiave.png");
    this.load.image("tettoPorta1", "./assets/images/environment/scena_3/tetti/tetto_porta1.png");
    this.load.image("tettoP4", "./assets/images/environment/scena_3/tetti/tetto_p4.png");
    this.load.image("tettoTopi", "./assets/images/environment/scena_3/tetti/tetto_topi.png");
    this.load.image("architravePorta", "./assets/images/environment/scena_3/tetti/architrave_porta.png");
    this.load.image("architraveTopi", "./assets/images/environment/scena_3/tetti/architrave_topi.png");

    // muri
    this.load.image("muroInizio", "./assets/images/environment/scena_3/muri/muro_inizio.png");
    this.load.image("muroChiave", "./assets/images/environment/scena_3/muri/muro_chiave.png");
    this.load.image("muroCheckpoint", "./assets/images/environment/scena_3/muri/muro_checkpoint.png");
    this.load.image("muroP4", "./assets/images/environment/scena_3/muri/muro_tetto_p4.png");
    this.load.image("muroSx", "./assets/images/environment/scena_3/muri/muro_sx_topi.png");
    this.load.image("muroDx", "./assets/images/environment/scena_3/muri/muro_dx_topi.png");

    // piattaforme che si muovono, che fanno rimbalzare, che si rompono
    this.load.image("nuvolaBase", "./assets/images/environment/scena_3/piattaforme/non_statiche/nuvola_base.png")
    this.load.image("nuvolaSchiacciata", "./assets/images/environment/scena_3/piattaforme/non_statiche/nuvola_schiacciata.png")
    this.load.image("montacarichi", "./assets/images/environment/scena_3/piattaforme/non_statiche/piattaforma_montacarichi.png");
    this.load.image("drone", "./assets/images/environment/scena_3/piattaforme/non_statiche/piattaforma_drone.png");
    this.load.image("breakablePlatform", "./assets/images/environment/scena_3/piattaforme/non_statiche/piattaforma_crepata.png");
    this.load.image("brokenPlatform", "./assets/images/environment/scena_3/piattaforme/non_statiche/piattaforma_rotta.png");

    // altro
    this.load.image("porta", "./assets/images/environment/porta.png");
    this.load.image("box", "./assets/images/environment/cassa.png");
    this.load.image("grataChiave", "./assets/images/environment/scena_3/piattaforme/statiche/grata_chiave.png");
    this.load.image("sfondoPalazzo", "./assets/images/environment/scena_3/sfondo_palazzo.png");
    this.load.image("sfondoMontacarichi", "./assets/images/environment/scena_3/montacarichi.png");
    this.load.image("antenna", "./assets/images/environment/scena_3/antenna.png");

    // spritesheet del protagonista
    this.load.spritesheet("playerMovements", "./assets/images/characters/player_movements.png", {
      frameWidth: 117,
      frameHeight: 125,
    });

    // collectibles
    this.load.image("chiave", "./assets/images/collectibles/chiave_oggetto.png");
    this.load.spritesheet("checkpoint", "./assets/images/collectibles/checkpoint.png", {
      frameWidth: 72,
      frameHeight: 100,
    });

    // nemici
    this.load.spritesheet("topo", "./assets/images/obstacles/rat_movements.png", {
      frameWidth: 100,
      frameHeight: 47,
    });

    // spritesheet tralicci 1
    this.load.spritesheet("energy1", "./assets/images/obstacles/energy_sprite.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    // spritesheet tralicci 2
    this.load.spritesheet("energy2", "./assets/images/obstacles/energy_sprite2.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    // spritesheet fumo
    this.load.spritesheet("fumo", "./assets/images/obstacles/fumo.png", {
      frameWidth: 200,
      frameHeight: 600,
    });

    // parete in overlay
    this.load.image("overlayEdificio", "./assets/images/environment/scena_3/overlay/overlay_palazzone.png");

    // UI
    this.load.image("cuore", "./assets/images/UI/HUD/cuore.png");
    this.load.image("noCuore", "./assets/images/UI/HUD/noCuore.png");
    this.load.image("missingKey", "./assets/images/UI/HUD/noChiaveUI.png");
    this.load.image("chiaveUI", "./assets/images/UI/HUD/chiaveUI.png");
  }

  create() {
    this.background = this.add.image(0, 0, "background3");
    this.background.setOrigin(0, 0).setScrollFactor(1, 1);

    this.elementsOnBkg();

    this.createEnenmies();

    // giocatore
    this.player = new Player(this, this.startX, this.startY, this.sceneWidth, this.floor);
    this.player.addEnemyReaction(this, this.enemy, this.game.gameState);

    // chiavi
    this.createKeys();

    // elementi che si possono passare da sotto
    this.createGrata();

    // porta
    this.porta = new Porta(this, 2565, 380, this.player);

    // checkpoints
    this.createCheckpoints();

    // box da spostare sul camino
    this.createCassa();

    // elemanti che fanno danno
    this.createDamagingElements();

    // piattaforme e altri elementi simili
    this.createBreakablePlatforms();
    this.createPlatforms();
    this.createMovingPlatforms();
    this.createBouncingPlatforms();

    // elementi in overlay
    this.elementsInOverlay();

    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.followOffset.set(-300, 0);

    // HUD della scena
    this.createUi();

    // scene good ending
    this.createEndingScenes();
    // porta good ending
    this.physics.add.overlap(this.player, this.toEnding, () => {
      this.goodEnding();
    }, null, this);
  }

  elementsOnBkg() {
    // immagini delle grate (elementi da cui si può passare sotto)
    this.grataChiave = [
      this.add.image(8095, 670, "grataChiave").setOrigin(0, 0),
      this.add.image(8095, 828, "grataChiave").setOrigin(0, 0),
    ];

    const sfondoPalazzo = this.add.image(2585, 102, "sfondoPalazzo").setOrigin(0, 0);
    const sfondoMontacarichi = this.add.image(2240, 300, "sfondoMontacarichi").setOrigin(0, 0);
    const antenna = this.add.image(2570, 110, "antenna").setOrigin(0, 1);

    // porta per andare nella torretta e good ending
    this.toEnding = this.add.rectangle(7780, this.floorHeight + 101, 155, 160, 0XFFF000, 0);
    this.toEnding.setOrigin(0, 1);
    this.physics.add.existing(this.toEnding);
    this.toEnding.body.allowGravity = false;
  }

  createEnenmies() {
    // nemici
    this.enemy = new Enemy(this, 4300, 700);
  }

  createGrata() {
    const grataToCollide = [this.player];

    const grateTrasparenti = [
      new Grata(this, { x: 8100, y: 670, width: 90, height: 10 }, [this.player]), // grata cassa
      new Grata(this, { x: 8100, y: 828, width: 90, height: 10 }, [this.player]), // grata tra due piattaforme
    ];

    // floor invisibile che causa danno quando giocatore collide, cadendo dai grattacieli
    this.floor = new Grata(this, { x: 0, y: this.game.config.height + 300, width: this.sceneWidth, height: 10 }, [this.player]);
  }

  createPlatforms() {
    // array che contiene gli elementi che collidono con le piattaforme
    const elementsToCollide = [this.player, this.enemy, this.cassa, this.keys[0], this.porta];

    // parametri da passare (this, oggetto {posizionex, posizioney}, nome texture, array collisioni)

    this.platformTopo = new Platform(this, { x: 4150, y: 985 }, "pEdificioTopi", [this.player, this.enemy]); // p edificio topi
    this.platformTopo.body.setSize(290, 113);

    // piattaforme
    const platformGroup1 = [
      new Platform(this, { x: 530, y: 463 }, "ringhieraInizio", [this.player]), // ringhiera p1
      new Platform(this, { x: -5, y: this.game.config.height - 200 }, "pInizio", [this.player]), // p1
      new Platform(this, { x: 1150, y: 596 }, "camino1", [this.player]), // camino p2
      new Platform(this, { x: 945, y: this.game.config.height - 5 }, "pCamino", [this.player]), // p2
      new Platform(this, { x: 1313, y: 955 }, "pEdificioChiave", [this.player]), // p sotto all'edificio chiave
      new Platform(this, { x: 2410, y: 380 }, "p4a", [this.player]), // p4a (prima parte)
      new Platform(this, { x: 2692, y: 640 }, "p4b", [this.player]), // p4b (seconda parte)
      new Platform(this, { x: 4135, y: 480 }, "asseTopi", [this.player]), // p4b (seconda parte)
      new Platform(this, { x: 4255, y: 680 }, "asseTopi", [this.player]), // p4b (seconda parte)
      new Platform(this, { x: 4455, y: 949 }, "scalino1", [this.player, this.enemy]), // scalino 1 dopo p topi
      new Platform(this, { x: 4495, y: 906 }, "scalino2", [this.player]), // scalino 2 dopo p topi
      new Platform(this, { x: 7620, y: 520 }, "pFinale", [this.player]), // p finale con porta per torre
    ];

    this.piattaformaCassa = new Platform(this, { x: 6080, y: 325 }, "pCassa", [this.player, this.cassa]); // p con sopra la cassa
    this.camino = new Platform(this, { x: 6380, y: 520 }, "camino2", [this.player]); // camino con fumo dannoso
    // quando cassa tocca camino, il fumo svanisce
    this.physics.add.collider(this.cassa, this.camino, () => {
      this.fadeOutEvent(this.fumo);
    }, null, this);

    // muri, elementi sporgenti e tetti
    const platformGroup2 = [
      new Platform(this, { x: 319, y: 240 }, "muroInizio", [this.player]), // architrave porta inizio
      new Platform(this, { x: 0, y: 155 }, "tettoInizio", [this.player]), // tetto all'inizio
      new Platform(this, { x: 4158, y: 245 }, "tettoTopi", [this.player]), // tetto topi
      new Platform(this, { x: 1549, y: 211 }, "muroChiave", [this.player]), // muro sx edificio chiave 
      new Platform(this, { x: 2068, y: 210 }, "muroChiave", [this.player]), // muro dx edificio chiave 
      new Platform(this, { x: 1550, y: this.game.config.height + 9 }, "tettoChiave", [this.player]), // tetto da abbasarsi (edificio chiave)
      new Platform(this, { x: 1455, y: 210 }, "asseChiave", [this.player, this.keys[0]]), // asse su cui si trova la chiave1 
      new Platform(this, { x: 1914, y: 210 }, "asse2", [this.player]), // asse per raggiungere chiave 
      new Platform(this, { x: 2088, y: 290 }, "asse3", [this.player]), // asse tra porta e chiave 
      new Platform(this, { x: 2555, y: 100 }, "architravePorta", [this.player]), // architrave checkpoint
      new Platform(this, { x: 2824, y: 127 }, "muroCheckpoint", [this.player]), // muro checkpoint 
      new Platform(this, { x: 2590, y: 100 }, "tettoPorta1", [this.player]), // tetto in alto checkpoint
      new Platform(this, { x: 2846, y: 376 }, "tettoP4", [this.player]), // tetto sopra p4a 
      new Platform(this, { x: 2898, y: 406 }, "muroP4", [this.player]), // architrave muro sopra p4b     
      new Platform(this, { x: 4130, y: 480 }, "muroSx", [this.player, this.enemy]), // muro sx topi 
      new Platform(this, { x: 4107, y: 480 }, "balconcinoTopi", [this.player]), // balconcino topi
      new Platform(this, { x: 4139, y: 245 }, "architraveTopi", [this.player, this.enemy]), // architrave topi
      new Platform(this, { x: 4469, y: 274 }, "muroDx", [this.player, this.enemy]), // muro dx topi
    ];
  }

  createMovingPlatforms() {
    // piattaforme che si muovono verticalmente
    this.montacarichi1 = new ElevatorPlatform(this, { x: 2207, y: 955 }, "montacarichi", [this.player]);
    this.montacarichi2 = new ElevatorPlatform(this, { x: 4801, y: 880 }, "montacarichi", [this.player]);

    // piattaforma che si muove orizzontalmente
    this.drone = new MovingPlatform(this, { x: 5030, y: 480 }, "drone", [this.player]);
  }

  createBouncingPlatforms() {
    // piattaforme su cui rimbalzare
    this.nuvole = [
      new BouncingPlatform(this, { x: 6700, y: 700 }, "nuvolaBase", [this.player]),
      new BouncingPlatform(this, { x: 7250, y: 650 }, "nuvolaBase", [this.player])
    ];
  }

  createBreakablePlatforms() {
    this.breakablePlatforms = [
      new BreakablePlatforms(this, { x: 3240, y: 560 }, "breakablePlatform", [this.player]),
      new BreakablePlatforms(this, { x: 3700, y: 560 }, "breakablePlatform", [this.player]),
      new BreakablePlatforms(this, { x: 4382, y: 480 }, "breakablePlatform", [this.player]),
      new BreakablePlatforms(this, { x: 4155, y: 680 }, "breakablePlatform", [this.player]),
      new BreakablePlatforms(this, { x: 8450, y: 920 }, "breakablePlatform", [this.player]),
    ];
  }

  createCassa() {
    this.cassa = new Cassa(this, 6150, 210, this.player);
  }

  createKeys() {
    // chiavi per aprire porte
    this.keyOnBreakablePlatform = new Key(this, 8450, 920, this.player)
    this.keyOnBreakablePlatform.body.allowGravity = false;
    this.keys = [
      new Key(this, 1450, 100, this.player),
      this.keyOnBreakablePlatform
    ];
  }

  createCheckpoints() {
    // parametri da passare (this, coordinata x, coordinata y, this.player, checkpoint id); inseriti in ordine di apparizione
    this.checkpoint0 = new Checkpoint(this, 2750, 640, this.player, 0);
    this.checkpoint1 = new Checkpoint(this, 4600, 907, this.player, 1);
    this.checkpoint2 = new Checkpoint(this, 6150, 324, this.player, 2);

    /* Il checkpoint id va messo in ordine di apparizione: il checkpoint che si incontra per primo avrà id = 0, quello dopo id = 1, quello ancora dopo id = 2, e così via */
    this.checkpoints = [this.checkpoint0, this.checkpoint1, this.checkpoint2];
  }

  elementsInOverlay() {
    // overlap trasparente per rimanere abbassato sotto al tetto edificio rotto
    this.underCeiling = this.add.rectangle(1500, this.game.config.height + 70, 437, 200, 0XFFFFFF, 0);
    this.underCeiling.setOrigin(0, 0);
    this.physics.add.existing(this.underCeiling);
    this.underCeiling.body.setImmovable(true).allowGravity = false;

    // overlay dell'edificio della chiave (prima nascosto, poi visibile quando ci passa addosso)
    this.overlayTettoBasso = this.add.image(1550, 210, "overlayEdificio").setOrigin(0, 0);
    this.physics.add.existing(this.overlayTettoBasso);
    this.overlayTettoBasso.body.allowGravity = false;
    this.physics.add.overlap(this.player, this.overlayTettoBasso, () => {
      this.fadeOutEvent(this.overlayTettoBasso);
    }, null, this);
  }

  createDamagingElements() {
    // elettroshock
    this.tralicci = [
      new AnimatedElements(this, 2548, 110, "energy1"),
      new AnimatedElements(this, 5120, 430, "energy2"),
      new AnimatedElements(this, 5440, 430, "energy1"),
      new AnimatedElements(this, 5750, 430, "energy2")
    ];

    for (const traliccio of this.tralicci) {
      traliccio.body.setImmovable(true).setSize(120, 70);
      traliccio.body.allowGravity = false;

      this.physics.add.collider(this.player, traliccio, () => {
        this.player.damagePlayer(this, this.game.gameState);
      }, null, this);
    }

    // fumo che danneggia
    this.fumo = new AnimatedElements(this, 6330, 525, "fumo").setOrigin(0, 1);
    this.fumo.body.setImmovable(true);
    this.fumo.body.allowGravity = false;
    this.physics.add.collider(this.player, this.fumo, () => {
      this.player.damagePlayer(this, this.game.gameState);
    }, null, this);
  }

  createUi() {
    // HUD cuori
    for (let i = 0; i <= 2; i++) {
      const noHeart = this.add.image(50 + 100 * i, 55, "noCuore").setScrollFactor(0, 0);
      let heart = this.add.image(50 + 100 * i, 55, "cuore").setScrollFactor(0, 0);
      this.hearts.push(heart);
    }

    // HUD chiave
    this.noChiaveUI = this.add.image(400, 55, "missingKey").setScrollFactor(0, 0);
    this.chiaveUI = this.add.image(400, 55, "chiaveUI").setScrollFactor(0, 0);
    this.chiaveUI.setVisible(false);
  }

  createEndingScenes() {
    // scena in cui protagonista spegne fabbriche e accende turbine
    this.salaControlloScene = this.add.image(0, 0, "salaControllo").setOrigin(0, 0);
    this.salaControlloScene.setVisible(false).setScrollFactor(0, 0);
    // pulizia del parco
    this.parcoScene = this.add.image(0, 0, "parcoScene").setOrigin(0, 0);
    this.parcoScene.setVisible(false).setScrollFactor(0, 0);
    // good ending
    this.goodEndingScene = this.add.image(0, 0, "goodEnding").setOrigin(0, 0);
    this.goodEndingScene.setVisible(false).setScrollFactor(0, 0);
  }

  fadeOutEvent(element) {
    // overlay dell'edificio chiave scompare
    this.overlayFading = this.time.addEvent({ delay: 50, callback: this.fadeOutOverlay(element), callbackScope: this, repeat: 10 });
  }

  fadeOutOverlay(element) {
    // l'opacità viene diminuita ad ogni ripetizione
    element.alpha -= 0.1;
    if (element.alpha === 0) {
      element.destroy();
    }
  }

  lifeUpdate(i) {
    // nascondi i cuori che sono stati persi
    this.hearts[i].setVisible(false);
  }

  checkCheckpoint() {
    // controllo tutti i checkpoints, per vedere quali ho preso e tengo quello con l'id piu alto
    // se dopo il ciclo ho ancora -1, significa che il player non ha preso alcun checkpoint
    this.takenId = -1;
    let takenX;
    let takenY;

    for (let i = 0; i < this.checkpoints.length; i++) {
      // se è stato preso
      if (this.checkpoints[i].isTaken) {
        // controllo che l'id sia superiore al mio e se lo è lo sostituisco
        if (this.checkpoints[i].checkpointId > this.takenId) {
          this.takenId = this.checkpoints[i].checkpointId;
          // dati della posizione X e Y del checkpoint
          takenX = this.checkpoints[i].checkpointX;;
          takenY = this.checkpoints[i].checkpointY;;
        }
      }
    }

    // se è diverso da -1, allora ho un checkpoint
    if (this.takenId != -1) {
      // restituisco le posizioni del checkpoint
      return { x: takenX, y: takenY };
    }
    else {
      // se non ho checkpoint, ritorno all'inizio del livello
      return { x: this.startX, y: this.startY };
    }
  }

  goodEnding() {
    // vengono mostrate le scene per continuità di storia
    if (this.player.hasKey) {
      this.isPlayerMovable = false;
      this.salaControlloScene.setVisible(true);

      this.time.delayedCall(4000, () => {
        this.parcoScene.setVisible(true);
      }, null, this);

      this.time.delayedCall(8000, () => {
        this.goodEndingScene.setVisible(true);
      }, null, this);

      this.time.delayedCall(12500, () => {
        this.scene.start("welcome");
      }, null, this);
    }
  }

  update() {
    this.player.moveManagement(this.isPlayerMovable);
    this.enemy.moveEnemy();
    this.enemy.patrolPlatform(this.platformTopo);

    this.montacarichi1.moveVertically(440, 955);
    this.montacarichi2.moveVertically(500, 880);
    this.drone.moveHorizontally(5000, 5890);

    this.checkpoint0.manageAnimations();
    this.checkpoint1.manageAnimations();
    this.checkpoint2.manageAnimations();

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

    for (let i = 0; i < this.nuvole.length; i++) {
      this.nuvole[i].bounce(this.player, this);
    }

    // scorro tutte le piattaforme che si rompono per verificare, se effettivamente il giocatore vi è sopra
    for (const breakPlatform of this.breakablePlatforms) {
      breakPlatform.checkPlayer(this.player, this);
    }

    if (this.montacarichi1.body.touching.up || this.montacarichi2.body.touching.up) {
      this.player.playerOnPlatform();
    }

    // quando giocatore cade da grattacieli
    if (this.floor.body.touching.up) {
      this.player.damagePlayer(this, this.game.gameState, false);

      // verifico se il giocatore ha preso almeno un checkpoint
      let isCheckpoint = this.checkCheckpoint();
      // se è diverso da null ho un checkpoint
      if (isCheckpoint != null) {
        this.player.x = isCheckpoint.x;
        this.player.y = isCheckpoint.y;
      }
    }

    // se il giocatore ha la chiave, compare nell'HUD, altrimenti la chiave non è attiva
    this.chiaveUI.setVisible(this.player.hasKey);

    // quando giocatore finisce le vite
    if (this.game.gameState.lives === 0) {
      this.scene.start("scena_3");
    }

    if (this.player.keyPause.isDown && this.isPlayerMovable) {
      this.scene.pause();
      this.scene.launch("pause_scene", { sceneName: "scena_3" });
    }
  }

  destroy() { }
}