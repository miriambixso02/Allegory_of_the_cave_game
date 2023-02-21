import Platform from "./staticPlatform.js";

export default class ElevatorPlatform extends Platform {

  constructor(scene, platformConfig, textureName, elementsToCollide) {
    super(scene, platformConfig, textureName, elementsToCollide);

    this.moveDown = true;
    this.setOrigin(0, 1);
    this.body.setSize(130, 40).setOffset(0, 80);
  }

  // funzione che gestisce il movimento verticale
  moveVertically(flipMin, flipMax) {
    if (this.moveDown) {
      this.body.velocity.y = 80;
      // flipMax è la massima altezza che può raggiungere
      if (this.y >= flipMax) {
        this.moveDown = false;
      }
    }
    if (!this.moveDown) {
      this.body.velocity.y = -80;
      // flipMin è la minima altezza che può raggiungere
      if (this.y <= flipMin) {
        this.moveDown = true;
      }
    }
  }
}