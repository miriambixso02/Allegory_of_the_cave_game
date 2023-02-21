export default class Key extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, player) {
    super(scene, x, y, "chiave");
    scene.add.existing(this);
    this.setOrigin(0, 1);

    scene.physics.add.existing(this);
    scene.physics.add.overlap(this, player, () => { this.takeKey(); player.changeKeyState(true) });

    this.body.setSize(this.displayWidth / 2, this.displayHeight).setOffset(this.displayWidth / 4, 0);
  }

  // raccogliere le chavi
  takeKey() {
    this.destroy();
  }
}