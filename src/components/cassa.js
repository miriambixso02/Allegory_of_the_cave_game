export default class Cassa extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, player) {
    super(scene, x, y, "box");
    scene.add.existing(this);
    this.setOrigin(0, 1);

    // aggiungi alla scena la fisica di questo elemento 
    scene.physics.add.existing(this);
    this.body.allowGravity = true;
    this.body.setMaxVelocityX(20);
    // Drag rappresenta un'accelerazione negativa che rallenta lo sprite quando si muove 
    // https://docs.idew.org/video-game/project-references/phaser-coding/physics-and-collisions#drag
    this.body.setDrag(80);

    // collider tra player e cassa
    scene.physics.add.collider(player, this, this.moveBox, null, this);
  }

  // funzione per spostare la cassa
  moveBox(player) {
    if (this.body.touching.up === true) {
      player.body.setVelocityY(0);
    } else {
      this.body.setBounceY(0.3);
    }
  }
}