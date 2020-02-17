class ThunderWeatherEffect extends SpecialEffect {
    static get label() {
        return "Thunder";
    }

    /* -------------------------------------------- */

    static get effectOptions() {
        const options = super.effectOptions;
        options.density.min = 0.001;
        options.density.value = 0.005;
        options.density.max = 0.01;
        options.density.step = 0.001;
        return options;
    }

    /* -------------------------------------------- */

    getParticleEmitters() {
        return [this._getThunderEmitter(this.parent)];
    }

    /* -------------------------------------------- */

    _getThunderEmitter(parent) {
        const d = canvas.dimensions;
        const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
        const config = mergeObject(this.constructor.CONFIG, {
            spawnRect: {
                x: d.paddingX,
                y: d.paddingY,
                w: d.sceneWidth,
                h: d.sceneHeight
            },
            maxParticles: p / 30,
            frequency: 30 * this.constructor.CONFIG.lifetime.min / p
        }, { inplace: false });
        const art = [
            "/modules/fxmaster/thunder/assets/thunder.png"
        ];
        var emitter = new PIXI.particles.Emitter(parent, art, config);
        return emitter;
    }
};

ThunderWeatherEffect.CONFIG = mergeObject(SpecialEffect.DEFAULT_CONFIG, {
    "alpha": {
        "list": [
            { "value": 0, "time": 0 },
            { "value": 0.9, "time": 0.5 },
            { "value": 0.7, "time": 0.95 },
            { "value": 0, "time": 1 }
        ],
    },
    "scale": {
        "list": [
            { "value": 0, "time": 0 },
            { "value": 0.4, "time": 0.2 },
            { "value": 0.38, "time": 1 },
        ],
    },
    "speed": {
        "start": 0,
        "end": 0,
        "minimumSpeedMultiplier": 0
    },
    "startRotation": {
        "min": 0,
        "max": 365
    },
    "rotation": {
        "min": 0,
        "max": 365
    },
    "rotationSpeed": {
        "min": 0,
        "max": 0
    },
    "lifetime": {
        "min": 1,
        "max": 2
    },
    "blendMode": "normal",
    "emitterLifetime": -1
}, { inplace: false });