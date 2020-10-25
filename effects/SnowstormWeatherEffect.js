export class SnowstormWeatherEffect extends SpecialEffect {
	static get label() {
		return "Snowstorm";
	}

	static get icon() {
		return "/modules/fxmaster/icons/weather/rain.png";
	}

	/* -------------------------------------------- */

	static get effectOptions() {
		const options = super.effectOptions;
		options.density.min = 0.5;
		options.density.value = 0.8;
		options.density.max = 0.9;
		options.density.step = 0.1;
		return options;
	}

	getParticleEmitters() {
		return [
			this._getRainEmitter(this.parent)
		];
	}

	/* -------------------------------------------- */

	_getRainEmitter(parent) {
		const d = canvas.dimensions;
		const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
		const config = mergeObject(this.constructor.RAIN_CONFIG, {
			spawnRect: {
				x: -0.05 * d.width,
				y: -0.10 * d.height,
				w: d.width,
				h: 0.8 * d.height
			},
			maxParticles: p,
			frequency: 1 / p
		}, { inplace: false });
		const art = [
		  "./modules/fxmaster/effects/assets/smoke_03.png",
		  "./modules/fxmaster/effects/assets/smoke_06.png",
		  "./modules/fxmaster/effects/assets/smoke_08.png"
		];
		return new PIXI.particles.Emitter(parent, art, config);
	}
}

// Configure the Snow particle
SnowstormWeatherEffect.RAIN_CONFIG = mergeObject(SpecialEffect.DEFAULT_CONFIG, {
	"alpha": {
		"start": 0.95,
		"end": 0.6
	},
	"scale": {
		"start": 0.08,
		"end": 0.02,
		"minimumScaleMultiplier": 0.8
	},
	"speed": {
		"start": 600,
		"end": 480,
		"minimumSpeedMultiplier": 0.7
	},
	"startRotation": {
		"min": 75,
		"max": 75
	},
	"rotation": 155,
	"rotationSpeed": {
		"min": -10.0,
		"max": 10.0
	},
	"lifetime": {
		"min": 1.5,
		"max": 3.5
	}
}, { inplace: false });