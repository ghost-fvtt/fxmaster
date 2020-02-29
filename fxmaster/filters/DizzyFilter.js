class DizzyFilter extends PIXI.filters.DisplacementFilter {
    constructor() {
        // Init displacement filter
        let dizzyMap = new PIXI.Sprite.from("/modules/fxmaster/filters/assets/clouds.png");
        super(dizzyMap);
        this.dizzyMap = dizzyMap;
        this.dizzyMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.dizzyMap.anchor.set(0.5);
        this.dizzyMap.x = canvas.scene.data.width / 2;
        this.dizzyMap.y = canvas.scene.data.height / 2;
        canvas.background.addChild(this.dizzyMap);
        let anim = {
            ease: Linear.easeNone,
            repeat: -1,
            x: 256
        }
        gsap.to(this.dizzyMap, 100, anim);

        // Default is to not display it
        this.enabled = false;
    }
}
