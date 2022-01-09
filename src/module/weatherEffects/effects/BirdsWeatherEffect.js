import { formatString } from "../../utils.js";
import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class BirdsWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Birds";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/crows.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.001, value: 0.006, max: 0.01, step: 0.001, decimals: 3 },
      "-=direction": undefined,
      animations: {
        label: "FXMASTER.Animations",
        type: "multi-select",
        options: {
          glide: "FXMASTER.WeatherBirdsAnimationsGlide",
          flap: "FXMASTER.WeatherBirdsAnimationsFlap",
          mixed: "FXMASTER.WeatherBirdsAnimationsMixed",
        },
        value: ["mixed"],
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

    const animations = {
      glide: [
        { textureNumber: 2, count: 30 },
        ...Array(4)
          .fill([
            { textureNumber: 1, count: 3 },
            { textureNumber: 2, count: 2 },
            { textureNumber: 3, count: 3 },
            { textureNumber: 2, count: 2 },
          ])
          .deepFlatten(),
        { textureNumber: 2, count: 68 },
      ],
      flap: [
        { textureNumber: 1, count: 3 },
        { textureNumber: 2, count: 2 },
        { textureNumber: 3, count: 3 },
        { textureNumber: 2, count: 2 },
      ],
      mixed: [
        { textureNumber: 2, count: 7 },
        { textureNumber: 1, count: 3 },
        { textureNumber: 2, count: 2 },
        { textureNumber: 3, count: 3 },
        { textureNumber: 2, count: 7 },
      ],
    };

    const getAnim = (animation, textureFormatString) => ({
      framerate: 20,
      loop: true,
      textures: animation.map(({ textureNumber, count }) => ({
        texture: formatString(textureFormatString, textureNumber),
        count,
      })),
    });

    const textureFormatString = "./modules/fxmaster/assets/weatherEffects/effects/seagull_{0}.png";

    // Assets are selected randomly from the list for each particle
    const anims = (this.options.animations?.value ?? [])
      .filter((animation) => Object.keys(animations).includes(animation))
      .map((animation) => getAnim(animations[animation], textureFormatString));

    if (anims.length === 0) {
      anims.push(getAnim(animations.mixed, textureFormatString));
    }

    const emitter = new PIXI.particles.Emitter(parent, anims, config);
    emitter.particleConstructor = PIXI.particles.AnimatedParticle;
    return emitter;
  }

  /**
   * Configuration for the Birds particle effect
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
          { value: 0.3, time: 0 },
          { value: 0.7, time: 0.1 },
          { value: 0.7, time: 0.9 },
          { value: 0.3, time: 1 },
        ],
        isStepped: false,
      },
      speed: {
        start: 90,
        end: 100,
        minimumSpeedMultiplier: 0.6,
      },
      startRotation: {
        min: 0,
        max: 360,
      },
      lifetime: {
        min: 20,
        max: 40,
      },
      blendMode: "normal",
      emitterLifetime: -1,
    },
    { inplace: false },
  );
}
