export default class Platform extends Phaser.GameObjects.Sprite {

  constructor(scene, platformConfig, textureName, elementsToCollide) {
    // estrai da oggetto platfomConfig le propietà x e y creando nuove variabili con i rispettivi nomi
    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    const { x, y } = platformConfig;

    super(scene, x, y, textureName);
    scene.add.existing(this);
    this.setOrigin(0, 0);

    // aggiungi alla scena la fisica di questo elemento (piattaforma)
    scene.physics.add.existing(this);
    this.body.setImmovable(true);
    this.body.allowGravity = false;

    // viene applicato il collider ad ogni elemento dell'array
    elementsToCollide.forEach(elem => scene.physics.add.collider(elem, this));
  }
}