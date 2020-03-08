class DizzyFilter extends PIXI.filters.DisplacementFilter {
    constructor() {
        let dizzyMap = new PIXI.Sprite.from("/modules/fxmaster/filters/assets/clouds.png");
        super(dizzyMap);
        this.enabled = false;
        this.dizzyMap = dizzyMap;
        this.dizzyMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.dizzyMap.anchor.set(0.5);
        this.scale.x = 50;
        this.scale.y = 50;
    }

    apply() {
        this.dizzyMap.x = canvas.scene.data.width / 2;
        this.dizzyMap.y = canvas.scene.data.height / 2;
        canvas.background.addChild(this.dizzyMap);
    }

    update() {
        if (this.enabled) {
            console.log("Drawing Dizzy Filter");
            Animation
            let anim = {
                ease: Linear.easeNone,
                repeat: -1,
                x: 256
            }
            this.transition = gsap.to(this.dizzyMap, 100, anim);
        }
    }

    switch() {
        this.enabled = !this.enabled;
        this.update();
    }
}
