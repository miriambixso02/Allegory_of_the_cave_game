import Platform from "./staticPlatform.js";

export default class BreakablePlatforms extends Platform {

	constructor(scene, platformConfig, textureName, elementsToCollide) {
		super(scene, platformConfig, textureName, elementsToCollide);

		this.canRegenerate = true; // se vero, la piattaforma si rigenera dopo un certo tempo
		this.regenerateTime = 6000; // tempo di rigenerazione
		this.regenerateWhenPlayerDeath = true;

		this.brokeTime = 800; // tempo in millisecondi dopo il quale la piattaforma si romperà
		this.isBroken = false; // variabile per capire se è rotto
		this.isBreaking = false;	// variabile per capire se si sta rompendo

		this.isShakingUp = false; // 
		this.shakeForce = 5; // indica la "violenza" delle vibrazioni
		this.shakeDelay = 75;

		// numero ripetizioni (mettendo un numero superiore a 3 e dispari, esso ritorna alla posizione originale)
		this.shakeRepeat = 11;
		this.returnYpos = 0;

		// Timer interni
		this.regenerateTimedEvent;
		this.fadeInTimedEvent;
		this.fadeOutTimedEvent;
		this.breakTimedEvent;
		this.shakeTimedEvent;
	}

	// funzione per capire se il giocatore si si trova sulla piattaforma.
	checkPlayer(player, scene) {
		// viene eseguita solo se la piattaforma non è già rotta o non si sta già rompendo
		if (this.body.touching.up && player.body.blocked.down && !this.isBreaking && !this.isBroken) {
			this.isBreaking = true;
			// timer nel quale dopo "brokeTime" secondi si rompe la piattaforma
			this.breakTimedEvent = scene.time.delayedCall(this.brokeTime, this.breakPlatform, [scene], this);

			this.shakeTimedEvent = scene.time.addEvent({
				delay: this.shakeDelay,
				callback: this.shakePlatform,
				callbackScope: this,
				repeat: this.shakeRepeat
			});
		}
	}

	// funzione che gestisce le vibrazioni della piattaforma
	shakePlatform() {
		// quando isShakingUp è vera, la piattaforma si alza; quando falsa, si abbassa
		if (this.isShakingUp) {
			this.y += this.shakeForce;
			// per mantenere il personaggio in posizione, viene cambiata la dimensione della hitbox a seconda del movimento verticale
			this.body.setSize(this.width, this.height + this.shakeForce, true);
			this.isShakingUp = false;
		}
		else {
			this.y -= this.shakeForce;
			this.body.setSize(this.width, this.height - this.shakeForce, true);
			this.isShakingUp = true;
		}
	}

	// funzione per rompere la piattaforma
	breakPlatform(scene) {
		// indicare che piattaforma è effettivamente rotta, per cui non si sta più rompendo
		this.isBroken = true;
		this.isBreaking = false;
		// viene cambiata la texture, per mettere quella con la piattaforma rotta
		this.setTexture("brokenPlatform");
		// tolto il collider, così player non può più starci sopra
		this.body.enable = false;

		// timer per farlo diventare invisibile 
		this.fadeOutTimedEvent = scene.time.addEvent({ delay: 50, callback: this.fadeOutPlatform, callbackScope: this, repeat: 10 });
		// timer di rigenerazione dopo essere stata distrutta
		if (this.canRegenerate) {
			this.regenerateTimedEvent = scene.time.delayedCall(this.regenerateTime, this.startFadeIn, [scene], this);
		}
	}

	// funzione per avviare il timer del Fade In
	startFadeIn(scene) {
		// reimpostata la texture iniziale
		this.setTexture("breakablePlatform");
		this.fadeInTimedEvent = scene.time.addEvent({ delay: 50, callback: this.fadeInPlatform, callbackScope: this, repeat: 10 });
	}

	// funzione del Fade Out (per far sparire la piattaforma)
	fadeOutPlatform() {
		// diminuisco il canale alpha di 0.1 (questo sarà ripetuto 10 volte)
		this.alpha -= 0.1;
		/* faccio cadere la piattaforma e memorizzo di quanto è caduta, perché se verrà rigenerata di colpo (es: quando il giocatore cade e muore) dovrò rimettere le coordinate Y mancanti */
		this.y += 1;
		this.returnYpos += 1;
	}

	// funzione del Fade In (la piattaforma riappare mentre il personaggio è vivo) 
	fadeInPlatform() {
		this.alpha += 0.1;
		this.y -= 1;
		this.returnYpos -= 1;

		// quando è completamente visibile, eseguo la funzione "regeneratePlatform" per ridargli tutte le caratteristiche iniziali
		if (this.alpha >= 1)
			this.regeneratePlatform();
	}

	// funzione per rigenerare la piattaforma
	regeneratePlatform() {
		if (this.isBroken) {
			// disattivi i timer
			if (this.regenerateTimedEvent) this.regenerateTimedEvent.remove();
			if (this.fadeInTimedEvent) this.fadeInTimedEvent.remove();
			if (this.fadeOutTimedEvent) this.fadeOutTimedEvent.remove();
			if (this.breakTimedEvent) this.breakTimedEvent.remove();
			if (this.shakeTimedEvent) this.shakeTimedEvent.remove();

			// reimpostata la texture iniziale
			this.setTexture("breakablePlatform");

			// reset delle variabili
			this.isBroken = false;
			this.isBreaking = false;
			this.isShakingUp = false;

			/* Riattivo il "collider" e imposto this.body.touching.up a FALSE per evitare un bug: se rimani sulla piattaforma mentre si rompe, questa variabile rimarrà TRUE. Verrà resettata una volta che body.enable ritornerà TRUE, ma rimarrà ancora TRUE pure se il personaggio non vi è sopra ancora per 1 frame, ma quel frame basterà per farla cadere al "respawn" della piattaforma stessa. */
			this.body.enable = true;
			this.body.touching.up = false;

			// canale alpha a 1
			this.alpha = 1;
			this.y -= this.returnYpos;
			this.returnYpos = 0;
		}
	}
}