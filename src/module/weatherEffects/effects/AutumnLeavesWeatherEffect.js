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
    return "modules/fxmaster/assets/weatherEffects/icons/leaves.png";
  }

  /** @override */
  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.05, value: 0.25, max: 1, step: 0.05, decimals: 2 },
      "-=direction": null,
    });
  }

  /**
   * Configuration for the falling leaves particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(
    SpecialEffect.DEFAULT_CONFIG,
    {
      alpha: {
        start: 0.9,
        end: 0.5,
      },
      scale: {
        start: 0.2,
        end: 0.4,
        minimumScaleMultiplier: 0.5,
      },
      speed: {
        start: 20,
        end: 60,
        minimumSpeedMultiplier: 0.6,
      },
      startRotation: {
        min: 0,
        max: 365,
      },
      rotation: 180,
      rotationSpeed: {
        min: 100,
        max: 200,
      },
      lifetime: {
        min: 10,
        max: 10,
      },
    },
    { inplace: false },
  );

  getParticleEmitters() {
    return [this._getLeafEmitter(this.parent)];
  }

  _getLeafEmitter(parent) {
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

    const sprites = Array.fromRange(6).map((n) => `ui/particles/leaf${n + 1}.png`);
    return new PIXI.particles.Emitter(parent, sprites, config);
  }
}
