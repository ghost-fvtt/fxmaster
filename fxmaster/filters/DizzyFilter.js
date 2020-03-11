class FXDizzyFilter extends PIXI.filters.DisplacementFilter {
    constructor(options) {
        let dizzyMap = new PIXI.Sprite.from("/modules/fxmaster/filters/assets/clouds.png");
        super(dizzyMap);
        this.dizzyMap = dizzyMap;
        this.transition = null;
        this.enabled = true;

        this.dizzyMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.dizzyMap.x = canvas.scene.data.width / 2;
        this.dizzyMap.y = canvas.scene.data.height / 2;
        this.dizzyMap.anchor.set(0.5);
        canvas.fxmaster.addChild(this.dizzyMap);
        let anim = {
            ease: Linear.easeNone,
            repeat: -1,
            x: 256
        }
        this.transition = gsap.to(this.maskSprite, 50, anim);
    }

    static get label() {
        return "Dizzy";
    }

    play() {}

    configure(opts) {
        if (!opts) return;
        const keys = Object.keys(opts);
        for (let i = 0; i < keys.length; ++i) {
            this[keys[i]] = opts[keys[i]];
        }
        this.play();
    }

    // So we can destroy object afterwards
    stop() {
        return new Promise((resolve, reject) => {
            this.enabled = false;
            this.transition.kill();
            resolve();
        });
    }
}
