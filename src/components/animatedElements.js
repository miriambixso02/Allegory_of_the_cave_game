export default class AnimatedElements extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, textureName) {
    super(scene, x, y, textureName);
    scene.add.existing(this);
    this.setOrigin(0, 1);

    scene.physics.add.existing(this);
    this.body.setSize(150, 0);

    // nome della texture con spritesheet
    this.textureAnimation = textureName;

    this.initAnimation();
  }

  // animazione dell'elem nelle diverse situazioni
  initAnimation() {
    // fermo
    this.anims.create({
      key: "elem_anim",
      frames: this.anims.generateFrameNumbers(this.textureAnimation, {
        start: 0,
        end: 9,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.play("elem_anim");
  }

  // gestione delle animazioni
  manageAnimations() {
    const currentAnim = this.anims.currentAnim.key;

    if (currentAnim != "elem_anim") {
      this.anims.play("elem_anim");
    }
  }
}