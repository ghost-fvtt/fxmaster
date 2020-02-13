class BubblesWeatherEffect extends SpecialEffect {
    static get label() {
        return "Bubbles";
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
        return [this._getBubbleEmitter(this.parent)];
    }

    /* -------------------------------------------- */

    _getBubbleEmitter(parent) {
        const d = canvas.dimensions;
        const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
        const config = mergeObject(this.constructor.BUBBLES_CONFIG, {
            spawnRect: {
                x: d.paddingX,
                y: d.paddingY,
                w: d.sceneWidth,
                h: d.sceneHeight
            },
            maxParticles: p,
            frequency: this.constructor.BUBBLES_CONFIG.lifetime.min / p
        }, { inplace: false });
        // Animation
        const anim_sheet =
        {
            framerate: "matchLife",
            textures: [
                {
                    texture: "/modules/fxmaster/bubbles/assets/Bubbles99.png",
                    count: 200
                },
                {
                    texture: "/modules/fxmaster/bubbles/assets/Pop1.png",
                    count: 1
                },
                {
                    texture: "/modules/fxmaster/bubbles/assets/Pop2.png",
                    count: 1
                },
                {
                    texture: "/modules/fxmaster/bubbles/assets/Pop3.png",
                    count: 1
                }
            ]
        };
        var emitter = new PIXI.particles.Emitter(parent, anim_sheet, config);
        emitter.particleConstructor = PIXI.particles.AnimatedParticle;
        return emitter;
    }
};

BubblesWeatherEffect.BUBBLES_CONFIG = mergeObject(SpecialEffect.DEFAULT_CONFIG, {
    "alpha": {
        "start": 0.9,
        "end": 0.5
    },
    "scale": {
        "start": 0.25,
        "end": 0.5,
        "minimumScaleMultiplier": 0.5
    },
    "speed": {
        "start": 20,
        "end": 60,
		"minimumSpeedMultiplier": 0.6
    },
    "color": {
        "start": "ffffff",
        "end": "ffffff"
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
    "maxParticles": 500,
    "blendMode": "normal",
    "emitterLifetime": 0
}, {inplace: false});