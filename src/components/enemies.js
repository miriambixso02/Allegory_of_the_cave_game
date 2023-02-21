export default class Enemy extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, "topo");
    scene.add.existing(this);
    this.setOrigin(0, 1);
    this.setFlipX(true);
    scene.physics.add.existing(this);
    this.body.setSize(50, 40).setOffset(20 * this.flipX, 4);

    this.initAnimation();
  }

  // animazione del topo nelle diverse situazioni
  initAnimation() {
    // corsa
    this.anims.create({
      key: "rat_anim",
      frames: this.anims.generateFrameNumbers("topo", {
        start: 0,
        end: 9,
      }),
      frameRate: 15,
      repeat: -1,
    });

    // fermo
    this.anims.create({
      key: "stop_rat_anim",
      frames: this.anims.generateFrameNumbers("topo", {
        start: 0,
        end: 0,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.play("stop_rat_anim");
  }

  // gestione delle animazioni
  manageAnimations() {
    const currentAnim = this.anims.currentAnim.key;

    if (this.body.velocity.x != 0) {
      // se si sta muovendo
      if (currentAnim != "rat_anim") {
        this.anims.play("rat_anim");
      }
    } else {
      // se topo fermo
      if (currentAnim != "stop_rat_anim") {
        this.anims.play("stop_rat_anim");
      }
    }
  }

  // velocità e flip orizzontale del topo
  moveEnemy() {
    this.body.setVelocityX(70);
    // ogni volta fatto il flip la velocità viene invertita
    if (this.flipX) {
      this.body.velocity.x *= (-1);
    }

    // animazioni gestite in una funzione differente
    this.manageAnimations();
  }

  // gestione del movimento a pattuglia
  patrolPlatform(platform) {
    // se il nemico si muove a destra e sta andando oltre il limite destro della piattaforma
    if (this.body.velocity.x > 0 && this.body.right >= platform.body.right) {
      this.setFlipX(true);
    }
    // se il nemico si muove a sinistra e sta andando oltre il limite sinistro della piattaforma
    else if (this.body.velocity.x < 0 && this.body.left <= platform.body.left) {
      this.setFlipX(false);
    }
  }
}
