export default class Player extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, maxWidth) {
    super(scene, x, y, "playerMovements");
    scene.add.existing(this);
    this.setOrigin(0.5, 1);

    this.isJumping = false;
    this.isDucking = false;
    this.maxWidth = maxWidth;
    this.invulnerable = false;
    this.vulnerableTime = 1000;
    this.hasKey = false;
    this.underCeiling = false;
    this.movementSpeed = 250;

    scene.physics.add.existing(this);
    this.resetHitbox();

    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    // aggiunto tasto space nella tastiera virtuale di Phaser
    this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyPause = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.initAnimation();
  }

  // animazione del player nelle diverse situazioni
  initAnimation() {
    // corsa
    this.anims.create({
      key: "run_anim",
      frames: this.anims.generateFrameNumbers("playerMovements", {
        start: 1,
        end: 9,
      }),
      frameRate: 15,
      repeat: -1,
    });

    // fermo
    this.anims.create({
      key: "stop_anim",
      frames: this.anims.generateFrameNumbers("playerMovements", {
        start: 0,
        end: 0,
      }),
      frameRate: 15,
      repeat: -1,
    });

    // salto
    this.anims.create({
      key: "jump_anim",
      frames: this.anims.generateFrameNumbers("playerMovements", {
        start: 10,
        end: 10,
      }),
      frameRate: 15,
      repeat: -1,
    });

    // abbassarsi 
    this.anims.create({
      key: "duck_anim",
      frames: this.anims.generateFrameNumbers("playerMovements", {
        start: 11,
        end: 15,
      }),
      frameRate: 15,
      repeat: -1,
    });

    // abbassato fermo
    this.anims.create({
      key: "stop_duck_anim",
      frames: this.anims.generateFrameNumbers("playerMovements", {
        start: 11,
        end: 11,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.play("stop_anim");
  }

  // gestione delle animazioni
  manageAnimations() {
    const currAnim = this.anims.currentAnim.key;

    if (this.body.velocity.y !== 0 || !this.body.touching.down) {
      // se muovimento verticale > playerJump
      if (currAnim != "jump_anim") {
        this.anims.play("jump_anim");
      }
      // configurazione del flip
      this.flipX = this.body.velocity.x < 0;

    } else if (this.body.velocity.x !== 0 && this.body.touching.down) {
      // se movimento orizzontale > playerRun
      if (!this.isDucking && !this.underCeiling) {
        if (currAnim != "run_anim") {
          this.anims.play("run_anim");
        }
      } else {
        if (currAnim != "duck_anim") {
          this.anims.play("duck_anim");
        }
      }
      this.flipX = this.body.velocity.x < 0;

    } else if (this.underCeiling) {
      this.anims.play("stop_duck_anim");
    } else {
      // se giocatore fermo
      if (this.isDucking) {
        if (currAnim != "stop_duck_anim") {
          this.anims.play("stop_duck_anim");
        }
      } else {
        if (currAnim != "stop_anim") {
          this.anims.play("stop_anim");
        }
      }
    }
  }

  // gestione del movimento 
  moveManagement(isPlayerMovable) {
    if (!this.isDucking && !this.underCeiling) {
      if (this.flipX) {
        this.body.setOffset(10, 0);
      } else {
        this.body.setOffset(15, 0);
      }
    }

    // movimento a sinistra
    if (this.cursorKeys.left.isDown && this.x >= 0 - this.displayWidth / 4) {
      this.body.setVelocityX(-this.movementSpeed);
    } else {
      // movimento a destra
      if (this.cursorKeys.right.isDown && this.x <= this.maxWidth - this.displayWidth / 4) {
        this.body.setVelocityX(this.movementSpeed);
      } else {
        // fermo
        this.body.setVelocityX(0);
      }
    }

    // salto
    if (this.keySpace.isDown && this.body.velocity.y == 0 && this.body.touching.down && !this.isDucking && !this.underCeiling) {
      if (!this.isJumping) {
        this.isJumping = true;
        this.body.setVelocityY(-310);
        this.resetHitbox();
      }
    }
    // fine salto
    if (this.keySpace.isUp) {
      this.isJumping = false;
    }

    // abbassarsi
    if (this.cursorKeys.down.isDown && this.body.velocity.y == 0 && this.body.touching.down) {
      // se non è già abbassato
      if (!this.isDucking) {
        this.isDucking = true;
        this.duckHitbox();
      }
    }
    // fine abbassamento
    if (this.cursorKeys.down.isUp && this.isDucking == true) {
      this.resetHitbox();
      this.isDucking = false;
    }

    if (!isPlayerMovable) {
      this.body.setVelocity(0, 0);
    }

    // animazioni gestite in una funzione differente
    this.manageAnimations();
  }

  resetHitbox() {
    this.body.setSize(90, 125);
  }

  duckHitbox() {
    this.body.setSize(90, 125 * 0.6);
    if (this.flipX) {
      this.body.setOffset(10, 125 * 0.4);
    } else {
      this.body.setOffset(15, 125 * 0.4);
    }
  }

  // overlap con nemico
  addEnemyReaction(scene, enemy, gameState) {
    scene.physics.add.overlap(this, enemy, () => {
      this.damagePlayer(scene, gameState);
    }, null);
  }

  // quando giocatore subisce danno
  damagePlayer(scene, gameState, showPlayerDamaged = true) {
    if (showPlayerDamaged) {
      this.setBlendMode(Phaser.BlendModes.SCREEN);
    }

    // se giocatore non è già invulnerabile
    if (!this.invulnerable && gameState.lives > 0) {
      gameState.lives -= 1;
      let i = gameState.lives;
      scene.lifeUpdate(i);

      // poni giocatore invulnerabile
      this.invulnerable = true;

      // metti un timer di 1 secondo, dopo richiama la funzione playerVulnerable per togliere invulnerabilità
      scene.time.delayedCall(this.vulnerableTime, () => this.playerVulnerable(), null, scene);
    }
  }

  // giocatore torna ad essere vulnerabile
  playerVulnerable() {
    this.invulnerable = false;
    this.setBlendMode(Phaser.BlendModes.NORMAL);
  }

  // rende vero il possesso della chiave
  changeKeyState(newState) {
    this.hasKey = newState;
  }

  // quando giocatore si trova sotto ad un tetto e non si può alzare
  updateUnder(isUnder) {
    if (isUnder) {
      this.underCeiling = true;
      this.body.setSize(90, 125 * 0.6);
      if (this.flipX) {
        this.body.setOffset(10, 125 * 0.4);
      } else {
        this.body.setOffset(15, 125 * 0.4);
      }
    } else {
      if (this.underCeiling) {
        this.underCeiling = false
        this.resetHitbox();
      }
    }
  }

  // se è a contatto con piattaforma, artificialmente, si comporta come se fosse su un pavimento non in movimento
  playerOnPlatform() {
    if (this.body.touching.down) {
      if (this.body.velocity.x !== 0) {
        // se movimento orizzontale > playerRun
        this.anims.play("run_anim");
        this.flipX = this.body.velocity.x < 0;
      } else {
        // se giocatore fermo
        this.anims.play("stop_anim");
      }
      if (this.keySpace.isDown) {
        if (!this.isJumping) {
          this.resetHitbox();
          this.isJumping = true;
          this.body.setVelocityY(-310);
        }
      }
      // fine salto
      if (this.keySpace.isUp) {
        this.isJumping = false;
      }
      // abbassarsi
      if (this.cursorKeys.down.isDown && !this.isJumping) {
        this.anims.play("stop_duck_anim");
        this.duckHitbox();
      } else {
        this.resetHitbox();
      }
    }
  }
}
