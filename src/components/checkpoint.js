export default class Checkpoint extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, player, checkpointId) {
    super(scene, x, y, "checkpoint");
    scene.add.existing(this);
    this.setOrigin(0, 1);

    scene.physics.add.existing(this);
    this.body.setImmovable(true);
    this.body.allowGravity = false;

    /* Il checkpoint id è per far capire al gioco quale checkpoint ho preso: il primo checkpoint avrà id = 0, il secondo id = 1... Vanno messi in ordine di apparizione perché poi il giocatore ricomparirà nel checkpoint con l'id piu alto. */
    this.checkpointId = checkpointId;
    this.isTaken = false;

    // posizioni per ripristinare il giocatore
    this.checkpointX = this.x;
    this.checkpointY = this.y;

    scene.physics.add.overlap(this, player, () => { this.doCheckpoint(scene); });
    // non bisogna distruggere il checkpoint per non modificare l'array della scena e per poterlo controllare ancora 

    this.initAnimation();
  }

  initAnimation() {
    // girandola che ruota
    this.anims.create({
      key: "spinning_anim",
      frames: this.anims.generateFrameNumbers("checkpoint", {
        start: 0,
        end: 9,
      }),
      frameRate: 15,
      repeat: -1,
    });

    // fermo
    this.anims.create({
      key: "still_anim",
      frames: this.anims.generateFrameNumbers("checkpoint", {
        start: 0,
        end: 0,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.play("still_anim");
  }

  // gestione delle animazioni
  manageAnimations() {
    const currentAnim = this.anims.currentAnim.key;

    // se checkpoint preso
    if (this.isTaken) {
      if (currentAnim != "spinning_anim") {
        this.anims.play("spinning_anim");
      }
    } else {
      if (currentAnim != "still_anim") {
        this.anims.play("still_anim");
      }
    }
  }

  // quando il checkpoint viene preso
  doCheckpoint() {
    // tolgo il collider e indico che il checkpoint è stato preso
    this.body.enable = false;
    this.isTaken = true;
  }
}