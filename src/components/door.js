export default class Porta extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, player) {
    super(scene, x, y, "porta");
    scene.add.existing(this);
    this.setOrigin(0, 1);

    scene.physics.add.existing(this);
    this.body.setImmovable(true);
    this.body.allowGravity = false;

    this.body.setSize(this.displayWidth / 2, this.displayHeight).setOffset(this.displayWidth / 2, 0);

    scene.physics.add.collider(player, this, this.openTheDoor, null, this);
  }

  openTheDoor(player) {
    // se hai la chiave, la porta si apre (viene distrutta) e non hai più la chiave
    if (this.body.touching.left && player.hasKey) {
      this.setVisible(false);
      this.body.destroy();
      player.changeKeyState(false);
    }
  }
} 