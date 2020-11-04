export class RainSimpleWeatherEffect extends SpecialEffect {
	static get label() {
    return "Rain without splash";
  }
  
  static get icon() {
    return "modules/fxmaster/icons/weather/rain.png";
  }

  /* -------------------------------------------- */

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
    }, {inplace: false});
    return new PIXI.particles.Emitter(parent, ["ui/particles/rain.png"], config);
  }
}

// Configure the Rain particle
RainSimpleWeatherEffect.RAIN_CONFIG = mergeObject(SpecialEffect.DEFAULT_CONFIG, {
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
}, {inplace: false});