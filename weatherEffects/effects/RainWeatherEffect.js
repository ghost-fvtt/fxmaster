import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

/**
 * A special full-screen weather effect which uses two Emitters to render drops and splashes
 * @type {SpecialEffect}
 */
export class RainWeatherEffect extends AbstractWeatherEffect {
	static get label() {
		return "Rain";
	}

	static get icon() {
		return "modules/fxmaster/weatherEffects/icons/rain.png";
	}


	// @override
	static get default() {
		const d = canvas.dimensions;
		const p = (d.width / d.size) * (d.height / d.size) * this.effectOptions.density.value;
		return {
			speed: 3500,
			scale: 1,
			direction: 75,
			density: Math.round(100 * p) / 100,
			tint: "#FFFFFF"
		}
	}

	/**
	 * Configuration for the particle emitter for rain
	 * @type {Object}
	 */
	static CONFIG = foundry.utils.mergeObject(SpecialEffect.DEFAULT_CONFIG, {
		"alpha": {
			"start": 0.7,
			"end": 0.1
		},
		"scale": {
			"start": 1.0,
			"end": 1.0,
			"minimumScaleMultiplier": 0.8
		},
		"speed": {
			"start": 3500,
			"end": 3500,
			"minimumSpeedMultiplier": 0.8
		},
		"startRotation": {
			"min": 75,
			"max": 75
		},
		"rotation": 90,
		"rotationSpeed": {
			"min": 0,
			"max": 0
		},
		"lifetime": {
			"min": 0.5,
			"max": 0.5
		}
	}, { inplace: false });

	/**
	 * Configuration for the particle emitter for splashes
	 * @type {Object}
	 */
	static SPLASH_CONFIG = foundry.utils.mergeObject(SpecialEffect.DEFAULT_CONFIG, {
		"alpha": {
			"start": 1,
			"end": 1
		},
		"scale": {
			"start": 0.6,
			"end": 0.6,
			"minimumScaleMultiplier": 0.8
		},
		"speed": {
			"start": 0,
			"end": 0
		},
		"startRotation": {
			"min": -90,
			"max": -90
		},
		"noRotation": true,
		"lifetime": {
			"min": 0.5,
			"max": 0.5
		}
	}, { inplace: false });

	/* -------------------------------------------- */

	getParticleEmitters() {
		return [
			this._getRainEmitter(this.parent),
			this._getSplashEmitter(this.parent)
		];
	}

	/* -------------------------------------------- */

	_getRainEmitter(parent) {
		const d = canvas.dimensions;
		const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
		const config = foundry.utils.mergeObject(this.constructor.CONFIG, {
			spawnRect: {
				x: -0.05 * d.width,
				y: -0.10 * d.height,
				w: d.width,
				h: 0.8 * d.height
			},
			maxParticles: p,
			frequency: 1 / p
		}, { inplace: false });
		return new PIXI.particles.Emitter(parent, ["ui/particles/rain.png"], config);
	}

	/* -------------------------------------------- */

	_getSplashEmitter(parent) {
		const d = canvas.dimensions;
		const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
		const config = foundry.utils.mergeObject(this.constructor.SPLASH_CONFIG, {
			spawnRect: {
				x: 0,
				y: 0.25 * d.height,
				w: d.width,
				h: 0.75 * d.height
			},
			maxParticles: 0.5 * p,
			frequency: 2 / p
		}, { inplace: false });
		return new PIXI.particles.Emitter(parent, ["ui/particles/drop.png"], config);
	}
}