import Player from "../components/player.js";
import AnimatedElements from "../components/animatedElements.js";
import Platform from "../components/platforms/staticPlatform.js";
import Enemy from "../components/enemies.js";
import Cassa from "../components/cassa.js";
import Porta from "../components/door.js";
import Key from "../components/keys.js";
import Grata from "../components/grata.js";

import { handleOverlapping } from '../utils.js';

export default class Scena2 extends Phaser.Scene {

  constructor() {
    super("scena_2");
  }

  init() {
    this.floorHeight = this.game.config.height;
    this.sceneWidth = 5000;
    this.startX = 100;
    this.startY = 710;
    this.isPlayerMovable = true;

    this.talk = false; // variabile che indica se posso parlare con npc
    this.whoTalks; // 0 indica l'impiegato, 1 indica il biglietto dei topi, 2 indica il foglietto della chiave

    // tasto per aprire le interazioni
    this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    // cuori della vita
    this.hearts = [];
    this.game.gameState.lives = 3;
  }

  preload() {
    this.load.image("background2", "./assets/images/background/sfondi_livello/mappa2.png");

    // immagini piattaforme
    this.load.image("p1", "./assets/images/environment/scena_2/piattaforme/p1.png");
    this.load.image("p2", "./assets/images/environment/scena_2/piattaforme/p2.png");
    this.load.image("p3", "./assets/images/environment/scena_2/piattaforme/p3.png");
    this.load.image("p4", "./assets/images/environment/scena_2/piattaforme/p4.png");
    this.load.image("p5", "./assets/images/environment/scena_2/piattaforme/p5.png");
    this.load.image("p6", "./assets/images/environment/scena_2/piattaforme/p6.png");
    this.load.image("p7", "./assets/images/environment/scena_2/piattaforme/p7.png");
    this.load.image("p8", "./assets/images/environment/scena_2/piattaforme/p8.png");
    this.load.image("p9", "./assets/images/environment/scena_2/piattaforme/p9.png");
    this.load.image("p10", "./assets/images/environment/scena_2/piattaforme/p10.png");
    this.load.image("p11", "./assets/images/environment/scena_2/piattaforme/p11.png");
    this.load.image("p12", "./assets/images/environment/scena_2/piattaforme/p12.png");
    this.load.image("p14", "./assets/images/environment/scena_2/piattaforme/p_ultima.png");
    this.load.image("sopratubo", "./assets/images/environment/scena_2/piattaforme/sopratubo.png");
    this.load.image("pilottino", "./assets/images/environment/scena_2/piattaforme/pilottino.png");
    this.load.image("pTopo", "./assets/images/environment/scena_2/piattaforme/p_topo.png");

    // elementi sporgenti
    this.load.image("bidone2", "./assets/images/environment/scena_2/piattaforme/bidone2.png");
    this.load.image("muretto2", "./assets/images/environment/scena_2/piattaforme/muretto2.png");
    this.load.image("scalino", "./assets/images/environment/scena_2/piattaforme/scalino.png");
    this.load.image("pCassaPorta", "./assets/images/environment/scena_2/piattaforme/p_cassa_porta.png");

    // soffitti
    this.load.image("tetto", "./assets/images/environment/scena_2/soffitti/tetto.png");
    this.load.image("soffittoPorta", "./assets/images/environment/scena_2/soffitti/soffitto_porta.png");

    // muri
    this.load.image("muro_cassa", "./assets/images/environment/scena_2/muri/muro_cassa.png");
    this.load.image("muroPorta", "./assets/images/environment/scena_2/muri/muro_porta.png");
    this.load.image("muroFine", "./assets/images/environment/scena_2/muri/muro_fine.png");
    this.load.image("palazzo", "./assets/images/environment/scena_2/muri/palazzo.png");

    // altro
    this.load.image("grata", "./assets/images/environment/scena_2/piattaforme/grata.png");
    this.load.image("porta", "./assets/images/environment/porta.png");
    this.load.image("box", "./assets/images/environment/cassa.png");
    this.load.image("ringhieraCasa", "assets/images/environment/scena_2/overlay/ringhiera.png");

    // collectibles
    this.load.image("chiave", "./assets/images/collectibles/chiave_oggetto.png");

    // icone di interazione
    this.load.image("readInteraction", "./assets/images/UI/lente.png");
    this.load.image("talkInteraction", "./assets/images/UI/dialogo.png");

    // player
    this.load.spritesheet("playerMovements", "./assets/images/characters/player_movements.png", {
      frameWidth: 117,
      frameHeight: 125,
    });

    // impiegato
    this.load.spritesheet("impiegatoMovements", "./assets/images/characters/impiegato_movements.png", {
      frameWidth: 104,
      frameHeight: 137,
    });

    // foglietti
    this.load.image("foglio", "./assets/images/environment/scena_2/foglietti.png");

    // nemici
    this.load.spritesheet("topo", "./assets/images/obstacles/rat_movements.png", {
      frameWidth: 100,
      frameHeight: 47,
    });

    // parete in overlay
    this.load.image("muroFognaOverlay", "./assets/images/environment/scena_2/overlay/overlay_muro.png");

    // UI
    this.load.image("cuore", "./assets/images/UI/HUD/cuore.png");
    this.load.image("noCuore", "./assets/images/UI/HUD/noCuore.png");
    this.load.image("missingKey", "./assets/images/UI/HUD/noChiaveUI.png");
    this.load.image("chiaveUI", "./assets/images/UI/HUD/chiaveUI.png");
  }

  create() {
    this.background = this.add.image(0, 0, "background2");
    this.background.setOrigin(0, 0).setScrollFactor(1, 1);

    this.elementsOnBkg();

    // nemici
    this.staticEnemy = new Enemy(this, 2500, 650);
    this.enemy = new Enemy(this, 4050, 150);
    this.enemiesGroup = this.physics.add.group([this.staticEnemy, this.enemy]);

    // impiegato
    this.impiegato = new AnimatedElements(this, 200, this.floorHeight + 10, "impiegatoMovements");

    // foglio topi e appartamento
    this.foglioTopi = this.add.image(2370, 600, "foglio");
    this.foglioChiave = this.add.image(4155, 450, "foglio");
    this.fogliGroup = this.physics.add.group([this.foglioTopi, this.foglioChiave]);
    this.foglioTopi.body.allowGravity = false;
    this.foglioChiave.body.allowGravity = false;

    // giocatore
    this.player = new Player(this, this.startX, this.startY, this.sceneWidth);
    this.player.addEnemyReaction(this, this.enemiesGroup, this.game.gameState);

    // chiave per aprire porta
    this.key = new Key(this, 3784, 80, this.player, this.player.hasKey);

    // cassa
    this.cassa = new Cassa(this, 3040, 200, this.player);
    // porta per andare all'ascensore
    this.porta = new Porta(this, 4600, this.floorHeight - 146, this.player);

    // grate da cui si passa da sotto
    this.createGrata();
    // piattaforme
    this.createPlatform();
    // per sistemare collisione tra cassa e scalino
    this.scalini.forEach(scalino => this.physics.add.collider(scalino, this.cassa));
    this.physics.add.collider(this)

    // NPC e foglietti interattivi
    this.createInteractions();

    // elementi in overlay
    this.elementsInOverlay();

    // porta livello successivo
    this.physics.add.overlap(this.player, this.nextLevel, () => {
      this.scene.start("scena_3");
    }, null, this);

    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.followOffset.set(-300, 0);

    // HUD della scena
    this.createUI();
  }

  // elementi che non fanno parte dello sfondo e sono più indietro del giocatore
  elementsOnBkg() {
    // immagine grata elemento (elemento che si può attraversare da sotto)
    this.grataImage = this.add.image(3370, 309, "grata");

    // porta per il livello successivo
    this.nextLevel = this.add.rectangle(4825, this.floorHeight - 147, 100, 160, 0XFFF000, 0);
    this.nextLevel.setOrigin(0, 1);
    this.physics.add.existing(this.nextLevel);
    this.nextLevel.body.allowGravity = false;
  }

  // quando player overlap oggetto compare immagine che mostra che è interagibile
  createInteractions() {
    this.interactiveTalk = this.add.image(this.impiegato.x + 120, this.impiegato.y - 150, "talkInteraction")
      .setVisible(false);
    this.interactiveRead1 = this.add.image(this.foglioTopi.x - 30, this.foglioTopi.y - 40, "readInteraction")
      .setVisible(false);
    this.interactiveRead2 = this.add.image(this.foglioChiave.x - 30, this.foglioChiave.y - 40, "readInteraction")
      .setVisible(false);

    // overlap impiegato
    this.physics.add.overlap(this.player, this.impiegato, () => {
      // simbolo per indicare che si può parlare
      this.whoTalks = 0;
      this.interactWithObject();
    }, null, this);

    //overlap avviso topi
    this.physics.add.overlap(this.player, this.foglioTopi, () => {
      // simbolo per indicare che si può leggere
      this.whoTalks = 1;
      this.interactWithObject();
    }, null, this);

    // overlap avviso chiave appartamento
    this.physics.add.overlap(this.player, this.foglioChiave, () => {
      // simbolo per indicare che si può leggere
      this.whoTalks = 2;
      this.interactWithObject();
    }, null, this);
  }

  createGrata() {
    const grataToCollide = [this.player, this.cassa];

    const grateTrasparenti = [
      new Grata(this, { x: 2800, y: 302, width: 715, height: 10 }, grataToCollide), // grata cassa
      new Grata(this, { x: 3500, y: this.floorHeight - 147, width: 715, height: 10 }, grataToCollide), // grata tra due piattaforme
    ];

    // floor invisibile che causa danno quando giocatore collide, cadendo dai grattacieli
    this.floor = new Grata(this, { x: 0, y: this.game.config.height + 300, width: this.sceneWidth, height: 10 }, [this.player]);
  }

  createPlatform() {
    // array che contiene gli elementi che collidono con le piattaforme
    const elementsToCollide = [this.player, this.enemy, this.staticEnemy, this.cassa, this.key, this.porta, this.impiegato];

    // parametri da passare (this, oggetto {posizionex, posizioney}, nome texture, array collisioni)

    // piattaforme sulla linea di terra
    const gruppoPlatform1 = [
      new Platform(this, { x: 0, y: this.floorHeight + 10 }, "p1", [this.player, this.impiegato]), // p1
      new Platform(this, { x: 650, y: this.floorHeight + 10 }, "p2", [this.player]), // p2
      new Platform(this, { x: 970, y: this.floorHeight - 173 }, "bidone2", [this.player]), // bidone
      new Platform(this, { x: 750, y: this.floorHeight - 78 }, "p3", [this.player]), // p3
      new Platform(this, { x: 1300, y: 370 }, "p4", [this.player]), // p4 - casa
      new Platform(this, { x: 2174, y: this.floorHeight - 30 }, "p5", elementsToCollide), // p5 - fogne
      new Platform(this, { x: 3380, y: this.floorHeight - 270 }, "pilottino", [this.player]), // p raggiungere cassa
      new Platform(this, { x: 3224, y: this.floorHeight - 147 }, "p7", [this.player, this.cassa, this.porta]), // p7 - pezzo sopra p6
      new Platform(this, { x: 3065, y: this.floorHeight - 35 }, "p6", [this.player]), // p6
    ];

    // piattaforme oltre la linea di terra
    const gruppoPlatform2 = [
      new Platform(this, { x: 3650, y: -87 }, "tetto", [this.player]), // tetto chiave
      new Platform(this, { x: 2395, y: -3 }, "palazzo", elementsToCollide), // palazzo sopra alla fogna
      new Platform(this, { x: 2840, y: -88 }, "tetto", [this.player]), // tetto cassa
      new Platform(this, { x: 2748, y: -90 }, "muro_cassa", [this.player, this.cassa]), // muro cassa
      new Platform(this, { x: 2315, y: 302 }, "p8", [this.player, this.cassa]), // piattaforma cassa
      new Platform(this, { x: 3700, y: -19 }, "p9", [this.player, this.cassa]), // muro chiave
      new Platform(this, { x: 3776, y: 138 }, "p10", [this.player, this.key]), // scalino 3 chiave (più alto)
      new Platform(this, { x: 3896, y: 176 }, "p11", [this.player]), // scalino 2 chiave
      new Platform(this, { x: 3936, y: 214 }, "p12", [this.player]), // scalino 1 chiave (più basso) 
    ];

    // piattaforma con il topo
    this.platformTopo = new Platform(this, { x: 3973, y: 250 }, "pTopo", [this.player, this.enemy]);

    // elementi sporgenti
    const gruppoPlatform3 = [
      new Platform(this, { x: 1143, y: this.floorHeight - 311 }, "muretto2", [this.player]), // muretto1
      new Platform(this, { x: 2236, y: 383 }, "sopratubo", [this.player]), // sporgenza fogna vicino a palazzo
      new Platform(this, { x: 4500, y: 333 }, "pCassaPorta", [this.player, this.cassa]), // p raggiungere chiave
      new Platform(this, { x: 4582, y: -124 }, "muroPorta", [this.player, this.cassa]), // muro porta
      new Platform(this, { x: 4622, y: -46 }, "soffittoPorta", [this.player, this.cassa]), // soffitto porta
      new Platform(this, { x: 5016, y: 300 }, "muroFine", [this.player, this.cassa]), // muro alla fine
      new Platform(this, { x: 4072, y: this.floorHeight - 147 }, "p14", [this.player, this.cassa]), // p porta
    ];

    this.scalini = [
      new Platform(this, { x: 3420, y: this.floorHeight - 161 }, "scalino", [this.player, this.cassa]), // scalino pilottino
      new Platform(this, { x: 2869, y: 286 }, "scalino", [this.player, this.cassa]), // scalino cassa
      new Platform(this, { x: 4490, y: this.floorHeight - 161 }, "scalino", [this.player, this.cassa]), // scalino cassa-porta
    ];
  }

  // elementi che non fanno parte dello sfondo e si trovano più avanti del protagonista
  elementsInOverlay() {
    // ringhiera casa p4
    this.ringhieraCasa = this.add.image(1273, 400, "ringhieraCasa").setOrigin(0, 1);

    // overlay dell'edificio (prima nascosto, poi visibile quando ci passa addosso)
    this.overlayFogna = this.add.image(2235, 380, "muroFognaOverlay").setOrigin(0, 0);
    this.physics.add.existing(this.overlayFogna);
    this.overlayFogna.body.setOffset(-3, 0).allowGravity = false;
    this.physics.add.overlap(this.player, this.overlayFogna, () => {
      this.fadeOutEvent();
    }, null, this);
  }

  createUI() {
    // HUD cuori
    for (let i = 0; i <= 2; i++) {
      const noHeart = this.add.image(50 + 100 * i, 55, "noCuore").setScrollFactor(0, 0);
      const heart = this.add.image(50 + 100 * i, 55, "cuore").setScrollFactor(0, 0);
      this.hearts.push(heart);
    }

    // HUD chiave
    this.noChiaveUI = this.add.image(400, 55, "missingKey").setScrollFactor(0, 0);
    this.chiaveUI = this.add.image(400, 55, "chiaveUI").setScrollFactor(0, 0);
    this.chiaveUI.setVisible(false);
  }

  fadeOutEvent() {
    // overlay del muro delle fogne scompare
    this.overlayFading = this.time.addEvent({ delay: 50, callback: this.fadeOutOverlay, callbackScope: this, repeat: 10 });
  }

  fadeOutOverlay() {
    // l'opacità viene diminuita ad ogni ripetizione
    this.overlayFogna.alpha -= 0.1;
  }

  lifeUpdate(i) {
    // nascondi i cuori che sono stati persi
    this.hearts[i].setVisible(false);
  }

  startPlayer() {
    // posizione in cui il player ricomincia a giocare
    this.player.x = this.startX;
    this.player.y = this.startY;
  }

  interactWithObject() {
    // se si preme x quando si può interagire, compaiono i testi
    if (this.keyX.isDown) {
      this.scene.pause();
      this.scene.launch("text_scene", { sceneName: "scena_2", slideIndex: this.whoTalks });
    }
  }

  updateIconsVisibility() {
    handleOverlapping(
      this.player,
      this.impiegato,
      () => { this.interactiveTalk.setVisible(true); },
      () => { this.interactiveTalk.setVisible(false); }
    );
    handleOverlapping(
      this.player,
      this.foglioTopi,
      () => { this.interactiveRead1.setVisible(true); },
      () => { this.interactiveRead1.setVisible(false); }
    );
    handleOverlapping(
      this.player,
      this.foglioChiave,
      () => { this.interactiveRead2.setVisible(true); },
      () => { this.interactiveRead2.setVisible(false); }
    );
  }

  update() {
    this.player.moveManagement(this.isPlayerMovable);
    this.enemy.moveEnemy();
    this.enemy.patrolPlatform(this.platformTopo);
    this.impiegato.manageAnimations();
    this.updateIconsVisibility();

    if (this.player.x > this.impiegato.x) {
      this.impiegato.setFlipX(true);
    } else {
      this.impiegato.setFlipX(false);
    }

    // quando giocatore cade da grattacieli
    if (this.floor.body.touching.up) {
      this.startPlayer(this.startX, this.startY);
      this.player.damagePlayer(this, this.game.gameState, false);
    }

    // se il giocatore ha la chiave, compare nell'HUD, altrimenti la chiave non è attiva
    if (this.player.hasKey) {
      this.chiaveUI.setVisible(true);
    }

    // se hai la chiave, la porta si apre (viene distrutta) e non hai più la chiave
    this.chiaveUI.setVisible(this.player.hasKey);

    // quando giocatore finisce le vite
    if (this.game.gameState.lives === 0) {
      this.scene.start("scena_2");
    }

    // menù di pausa
    if (this.player.keyPause.isDown) {
      this.scene.pause();
      this.scene.launch("pause_scene", { sceneName: "scena_2" });
    }
  }

  destroy() { }
}