export default class Grata extends Phaser.GameObjects.Rectangle {

  constructor(scene, grataConfig, grataToCollide) {
    const { x, y, width, height } = grataConfig;
    super(scene, x, y, width, height);

    scene.add.existing(this);
    this.setFillStyle(); // trasparente
    this.setOrigin(0, 0);

    scene.physics.add.existing(this);
    this.body.setImmovable(true);
    this.body.allowGravity = false;
    this.body.checkCollision.down = false;
    this.body.checkCollision.right = false;
    this.body.checkCollision.left = false;

    // viene applicato  collider ad ogni elemento dell'array
    grataToCollide.forEach(elem => scene.physics.add.collider(elem, this));
  }
}