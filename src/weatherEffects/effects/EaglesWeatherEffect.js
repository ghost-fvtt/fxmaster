import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class EaglesWeatherEffect extends AbstractWeatherEffect {
  /**
   * The cached textures for this weather effect.
   * @type {PIXI.Texture[] | undefined}
   * @private
   */
  static _textureCache = undefined;

  static get label() {
    return "Eagles";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/crows.png";
  }

  /** @override */
  static get group() {
    return "animals";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.001, value: 0.006, max: 0.01, step: 0.001, decimals: 3 },
      "-=direction": undefined,
      animations: {
        label: "FXMASTER.Animations",
        type: "multi-select",
        options: {
          flap: "FXMASTER.WeatherBirdsAnimationsFlap",
          glide: "FXMASTER.WeatherBirdsAnimationsGlide",
        },
        value: ["glide"],
      },
    });
  }

  getParticleEmitters() {
    return [this._getEmitter(this.parent)];
  }

  // This is where the magic happens
  _getEmitter(parent) {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const config = foundry.utils.mergeObject(
      this.constructor.CONFIG,
      {
        spawnRect: {
          x: d.sceneRect.x,
          y: d.sceneRect.y,
          w: d.sceneRect.width,
          h: d.sceneRect.height,
        },
        maxParticles: p,
        frequency: this.constructor.CONFIG.lifetime.min / p,
      },
      { inplace: false },
    );
    this.applyOptionsToConfig(config);

    if (!this._textures) {
      this._initializeTextures();
    }

    const flap = Array.fromRange(19).map((textureNumber) => ({
      textureNumber,
      count: 1,
    }));

    const glide = [
      { textureNumber: 0, count: 30 },
      ...Array(4).fill(flap).deepFlatten(),
      { textureNumber: 0, count: 68 },
    ];

    const animations = {
      glide,
      flap,
    };

    const getAnim = (animation) => ({
      framerate: 20,
      loop: true,
      textures: animation.map(({ textureNumber, count }) => ({
        texture: this._textures[textureNumber],
        count,
      })),
    });

    // Assets are selected randomly from the list for each particle
    const anims = (this.options.animations?.value ?? [])
      .filter((animation) => Object.keys(animations).includes(animation))
      .map((animation) => getAnim(animations[animation]));

    if (anims.length === 0) {
      anims.push(getAnim(animations.glide));
    }

    const emitter = new PIXI.particles.Emitter(parent, anims, config);
    emitter.particleConstructor = PIXI.particles.AnimatedParticle;
    return emitter;
  }

  /**
   * Configuration for the Eagles particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(
    SpecialEffect.DEFAULT_CONFIG,
    {
      alpha: {
        list: [
          { value: 0, time: 0 },
          { value: 1, time: 0.02 },
          { value: 1, time: 0.98 },
          { value: 0, time: 1 },
        ],
        isStepped: false,
      },
      scale: {
        list: [
          { value: 0.15, time: 0 },
          { value: 0.3, time: 0.1 },
          { value: 0.3, time: 0.9 },
          { value: 0.15, time: 1 },
        ],
        isStepped: false,
      },
      speed: {
        start: 360,
        end: 400,
        minimumSpeedMultiplier: 0.6,
      },
      startRotation: {
        min: 0,
        max: 360,
      },
      lifetime: {
        min: 7,
        max: 14,
      },
      blendMode: "normal",
      emitterLifetime: -1,
    },
    { inplace: false },
  );

  /**
   * Get the textures for this weather effect.
   * @private
   * @returns {PIXI.Texture[]}
   */
  get _textures() {
    if (!this.constructor._textureCache) {
      const spriteSheetTexture = PIXI.Texture.from("modules/fxmaster/assets/weatherEffects/effects/eagle.png");
      const spriteSheetData = {
        meta: {
          scale: "1",
        },
        frames: {
          "eagle0000.png": {
            frame: { x: 0, y: 0, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0001.png": {
            frame: { x: 512, y: 0, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0002.png": {
            frame: { x: 0, y: 512, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0003.png": {
            frame: { x: 512, y: 512, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0004.png": {
            frame: { x: 1024, y: 0, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0005.png": {
            frame: { x: 1024, y: 512, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0006.png": {
            frame: { x: 0, y: 1024, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0007.png": {
            frame: { x: 512, y: 1024, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0008.png": {
            frame: { x: 1024, y: 1024, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0009.png": {
            frame: { x: 1536, y: 0, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0010.png": {
            frame: { x: 1536, y: 512, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0011.png": {
            frame: { x: 1536, y: 1024, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0012.png": {
            frame: { x: 0, y: 1536, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0013.png": {
            frame: { x: 512, y: 1536, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0014.png": {
            frame: { x: 1024, y: 1536, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0015.png": {
            frame: { x: 1536, y: 1536, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0016.png": {
            frame: { x: 2048, y: 0, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0017.png": {
            frame: { x: 2048, y: 512, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0018.png": {
            frame: { x: 2048, y: 1024, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
          "eagle0019.png": {
            frame: { x: 2048, y: 1536, w: 512, h: 512 },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: 512, h: 512 },
            sourceSize: { w: 512, h: 512 },
          },
        },
      };
      const spriteSheet = new PIXI.Spritesheet(spriteSheetTexture, spriteSheetData);
      spriteSheet.parse((textures) => {
        this.constructor._textureCache = Object.values(textures);
      }); // This is known to complete synchronously because there are only 20 textures and PIXI only starts batching when there are more than 1000.
    }
    return this.constructor._textureCache;
  }
}
