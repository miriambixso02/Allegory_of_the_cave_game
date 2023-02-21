import Platform from "./staticPlatform.js";

export default class BouncingPlatform extends Platform {

  constructor(scene, platformConfig, textureName, elementsToCollide) {
    super(scene, platformConfig, textureName, elementsToCollide);

    this.setOrigin(0.5, 0.5);
  }

  // per far rimbalzare il giocatore
  bounce(player, scene) {
    if (this.body.touching.up) {
      player.body.setVelocityY(-500);

      this.setTexture("nuvolaSchiacciata");
      this.y += 10;

      scene.time.delayedCall(150, () => {
        this.setTexture("nuvolaBase");
        this.y -= 10;
      }, [scene], this);
    }
  }
}