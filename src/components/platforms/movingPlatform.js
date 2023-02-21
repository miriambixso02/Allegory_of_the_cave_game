import Platform from "./staticPlatform.js";

export default class MovingPlatform extends Platform {

  constructor(scene, platformConfig, textureName, elementsToCollide) {
    super(scene, platformConfig, textureName, elementsToCollide);
    this.moveRight = true;
  }

  // funzione che gestisce il movimento orizzontale
  moveHorizontally(flipMin, flipMax) {
    if (this.moveRight) {
      this.body.velocity.x = 70;
      // flipMax è la distanza massima a destra che può raggiungere
      if (this.x >= flipMax) {
        this.moveRight = false;
      }
    }
    if (!this.moveRight) {
      this.body.velocity.x = -70;
      // flipMin è la distanza massima a sinistra che può raggiungere
      if (this.x <= flipMin) {
        this.moveRight = true;
      }
    }
    // per impedire che il giocatore scivoli via
    this.body.setFriction(1);
    this.body.setDrag(1);
  }
}