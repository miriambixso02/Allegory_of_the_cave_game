// funzione per gestire l'overlap tra vari oggetti
export function handleOverlapping(spriteA, spriteB, onEnter, onExit) {
  const boundsA = spriteA.getBounds();
  const boundsB = spriteB.getBounds();

  // se la hitbox del primo oggetto interseca l'altro esegui azione onEnter, altrimenti esegui onExit
  if (Phaser.Geom.Rectangle.Overlaps(boundsA, boundsB)) {
    onEnter();
  } else {
    onExit();
  }
}

// funzione per controllare se un oggetto contiene completamente il secondo
export function handleContaining(spriteA, spriteB, onEnter, onExit) {
  const boundsA = spriteA.getBounds();
  const boundsB = spriteB.getBounds();

  if (Phaser.Geom.Rectangle.ContainsRect(boundsA, boundsB)) {
    onEnter();
  } else {
    onExit();
  }
}