import { packageId } from "../constants.js";
import { logger } from "../logger.js";
import { executeWhenWorldIsMigratedToLatest, isOnTargetMigration } from "../migration/migration.js";
import { isEnabled } from "../settings.js";

export class ParticleEffectsLayer extends FullCanvasObjectMixin(CanvasLayer) {
  constructor() {
    super();
    this.#initializeInverseOcclusionFilter();
    this.mask = canvas.masks.scene;
    this.sortableChildren = true;
    this.eventMode = "none";
  }

  /**
   * Initialize the inverse occlusion filter.
   */
  #initializeInverseOcclusionFilter() {
    this.occlusionFilter = WeatherOcclusionMaskFilter.create({
      occlusionTexture: canvas.masks.depth.renderTexture,
    });
    this.occlusionFilter.enabled = false;
    this.occlusionFilter.elevation = this.elevation;
    this.occlusionFilter.blendMode = PIXI.BLEND_MODES.NORMAL;
    this.filterArea = canvas.app.renderer.screen;
    this.filters = [this.occlusionFilter];
  }

  /** @override */
  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, { name: "particle-effects" });
  }

  /**
   * The currently active particle effects.
   * @type {Map<string, import('./effects/effect.js').FXMasterParticleEffect>}
   */
  particleEffects = new Map();

  /**
   * The inverse occlusion mask filter bound to this container.
   * @type {WeatherOcclusionMaskFilter}
   */
  occlusionFilter;

  /**
   * Define an elevation property on the ParticleEffectsLayer layer.
   * For now, it simply referenes the elevation property of the {@link WeatherEffects} provided by
   * foundry.
   * @type {number}
   */
  get elevation() {
    return canvas.weather?.elevation ?? Infinity;
  }

  set elevation(value) {
    const weatherEffects = canvas.weather;
    if (weatherEffects) {
      weatherEffects.elevation = value;
    }
  }

  /** @override */
  async _draw() {
    if (!isEnabled()) {
      return;
    }
    if (isOnTargetMigration()) {
      await this.#draw();
    } else {
      // If migrations need to be performed, defer drawing to when they are done.
      executeWhenWorldIsMigratedToLatest(this.#draw.bind(this));
    }
  }

  /** @override */
  async _tearDown() {
    this.#destroyEffects();
    return super._tearDown();
  }

  #destroyEffects() {
    if (this.particleEffects.size === 0) return;
    for (const ec of this.particleEffects.values()) {
      ec.destroy();
    }
    this.particleEffects.clear();
  }

  /**
   * Actual implementation of drawing the layer.
   */
  async #draw() {
    await this.drawParticleEffects();
  }

  async drawParticleEffects({ soft = false } = {}) {
    if (!canvas.scene) {
      return;
    }
    let zIndex = 0;

    const stopPromise = Promise.all(
      [...this.particleEffects.entries()].map(async ([id, effect]) => {
        if (soft) {
          await effect.fadeOut({ timeout: 20000 });
        } else {
          effect.stop();
        }
        effect.destroy();
        // The check is needed because a new effect might have been set already.
        if (this.particleEffects.get(id) === effect) {
          this.particleEffects.delete(id);
        }
      }),
    );

    const flags = canvas.scene.getFlag(packageId, "effects") ?? {};
    if (Object.keys(flags).length > 0) {
      this.occlusionFilter.enabled = true;
    }
    for (const [id, { type, options: flagOptions }] of Object.entries(flags)) {
      if (!(type in CONFIG.fxmaster.particleEffects)) {
        logger.warn(`Particle effect '${id}' is of unknown type '${flags[id].type}', skipping it.`);
        continue;
      }
      const options = Object.fromEntries(
        Object.entries(flagOptions).map(([optionName, value]) => [optionName, { value }]),
      );

      const ec = new CONFIG.fxmaster.particleEffects[type](options);
      ec.zIndex = zIndex++;
      ec.blendMode = PIXI.BLEND_MODES.NORMAL;

      this.addChild(ec);
      this.particleEffects.set(id, ec);
      ec.play({ prewarm: !soft });
    }

    await stopPromise;

    if (this.particleEffects.size === 0) {
      this.occlusionFilter.enabled = false;
    }
  }
}
