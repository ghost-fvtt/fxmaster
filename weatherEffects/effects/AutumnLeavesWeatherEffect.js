import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

/**
 * A special full-screen weather effect which uses one Emitters to render gently falling autumn leaves
 * @extends {SpecialEffect}
 */
 export class AutumnLeavesWeatherEffect extends AbstractWeatherEffect {
	static get label() {
    return "Autumn Leaves";
  }

  static get icon() {
    return "modules/fxmaster/weatherEffects/icons/leaves.png";
  }

  // @override
  static get default() {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.effectOptions.density.value;
    return {
      speed: 60,
      scale: 1,
      direction: 180,
	  density: Math.round(100 * p) / 100,
	  tint: "#FFFFFF"
    }
  }

	/**
	 * Configuration for the falling leaves particle effect
	 * @type {Object}
	 */
	static CONFIG = foundry.utils.mergeObject(SpecialEffect.DEFAULT_CONFIG, {
		"alpha": {
			"start": 0.9,
			"end": 0.5
		},
		"scale": {
			"start": 0.2,
			"end": 0.4,
			"minimumScaleMultiplier": 0.5
		},
		"speed": {
			"start": 20,
			"end": 60,
			"minimumSpeedMultiplier": 0.6
		},
		"startRotation": {
			"min": 0,
			"max": 365
		},
		"rotation": 180,
		"rotationSpeed": {
			"min": 100,
			"max": 200
		},
		"lifetime": {
			"min": 10,
			"max": 10
		},
	}, {inplace: false});

  /* -------------------------------------------- */

	static get effectOptions() {
		const options = super.effectOptions;
		options.density.min = 0.05;
		options.density.value = 0.25;
		options.density.max = 1;
		options.density.step = 0.05;
		return options;
	}

  /* -------------------------------------------- */

  getParticleEmitters() {
		return [this._getLeafEmitter(this.parent)];
  }

  /* -------------------------------------------- */

  _getLeafEmitter(parent) {
  	const d = canvas.dimensions;
		const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const config = foundry.utils.mergeObject(this.constructor.CONFIG, {
      spawnRect: {
        x: d.paddingX,
        y: d.paddingY,
        w: d.sceneWidth,
        h: d.sceneHeight
      },
			maxParticles: p,
			frequency: this.constructor.CONFIG.lifetime.min / p
    }, {inplace: false});
    const sprites = Array.fromRange(6).map(n => `ui/particles/leaf${n+1}.png`);
    return new PIXI.particles.Emitter(parent, sprites, config);
  }
}