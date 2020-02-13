class EmbersWeatherEffect extends SpecialEffect {
    static get label() {
        return "Embers";
    }

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
        return [this._getEmbersEmitter(this.parent)];
    }

    /* -------------------------------------------- */

    _getEmbersEmitter(parent) {
        const d = canvas.dimensions;
        const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
        const config = mergeObject(this.constructor.EMBERS_CONFIG, {
            spawnRect: {
                x: d.paddingX,
                y: d.paddingY,
                w: d.sceneWidth,
                h: d.sceneHeight
            },
            maxParticles: p,
            frequency: this.constructor.EMBERS_CONFIG.lifetime.min / p
        }, { inplace: false });
        // Animation
        const art = [
            "/modules/fxmaster/embers/assets/particle.png"
        ]
        var emitter = new PIXI.particles.Emitter(parent, art, config);
        return emitter;
    }
};

EmbersWeatherEffect.EMBERS_CONFIG = mergeObject(SpecialEffect.DEFAULT_CONFIG, {
    "alpha": {
        "start": 0.9,
        "end": 0
    },
    "scale": {
        "start": 0.3,
        "end": 0.05,
        "minimumScaleMultiplier": 0.9
    },
    "speed": {
        "start": 40,
        "end": 25,
        "minimumSpeedMultiplier": 0.6
    },
    "color": {
        "start": "ff622c",
        "end": "fff191"
    },
	"acceleration": {
		"x": 1,
		"y": 1
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
        "min": 5,
        "max": 8
    },
    "maxParticles": 200,
    "blendMode": "normal",
    "emitterLifetime": 0
}, { inplace: false });