import { packageId } from "../constants.js";
import { logger } from "../logger.js";
import { executeWhenWorldIsMigratedToLatest, isOnTargetMigration } from "../migration/migration.js";
import { isEnabled } from "../settings.js";

export class ParticleEffectsLayer extends CanvasLayer {
  /**
   * The particle overlay container.
   * @type {FullCanvasContainer| undefined}
   */
  particleEffectsContainer;

  /**
   * The currently active particle effects.
   * @type {Record<string, {type: string, fx: import('./effects/effect.js').FXMasterParticleEffect}>}
   */
  particleEffects = {};

  /**
   * An occlusion filter that prevents particle effects from being displayed in certain regions.
   * @type {InverseOcclusionMaskFilter | undefined}
   */
  particleEffectOcclusionFilter;

  /**
   * Define an elevation property on the ParticleEffectsLayer layer.
   * For now, it simply referenes the elevation property of the {@link WeatherEffects} provided by
   * foundry and adds 0.5 to it, so that FXMaster particle effects are always rendered on top of the
   * weather effects provided by foundry.
   * @type {number}
   */
  get elevation() {
    return (canvas.weather?.elevation ?? 9999) + 0.5;
  }

  set elevation(value) {
    const weatherEffects = canvas.weather;
    if (weatherEffects) {
      weatherEffects.elevation = value - 0.5;
    }
  }

  /** @override */
  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, { name: "particle-effects" });
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
    Object.values(this.particleEffects).forEach(({ fx }) => fx.destroy());

    this.particleEffectsContainer = undefined;
    this.particleEffects = {};
    this.particleEffectOcclusionFilter = undefined;

    return super._tearDown();
  }

  /**
   * Actual implementation of drawing the layer.
   * @private
   */
  async #draw() {
    this.particleEffectOcclusionFilter = this.#createParticleEffectOcclusionFilter();
    await this.drawParticleEffects();
  }

  async drawParticleEffects({ soft = false } = {}) {
    if (!canvas.scene) {
      return;
    }
    if (!this.particleEffectsContainer) {
      const particleEffectsContainer = new FullCanvasContainer();
      particleEffectsContainer.accessibleChildren = particleEffectsContainer.interactiveChildren = false;
      particleEffectsContainer.filterArea = canvas.app.renderer.screen;
      this.particleEffectsContainer = this.addChild(particleEffectsContainer);
      if (this.particleEffectOcclusionFilter) {
        this.particleEffectsContainer.filters = [this.particleEffectOcclusionFilter];
      }
    }

    const stopPromise = Promise.all(
      Object.entries(this.particleEffects).map(async ([id, effect]) => {
        if (soft) {
          await effect.fx.fadeOut({ timeout: 20000 });
        } else {
          effect.fx.stop();
        }
        // The check is needed because a new effect might have been set already.
        if (this.particleEffects[id] === effect) {
          delete this.particleEffects[id];
        }
      }),
    );

    const flags = canvas.scene.getFlag(packageId, "effects") ?? {};
    if (Object.keys(flags).length > 0) {
      this.particleEffectOcclusionFilter.enabled = true;
    }
    for (const id in flags) {
      if (!(flags[id].type in CONFIG.fxmaster.particleEffects)) {
        logger.warn(`Particle effect '${id}' is of unknown type '${flags[id].type}', skipping it.`);
        continue;
      }
      const options = Object.fromEntries(
        Object.entries(flags[id].options).map(([optionName, value]) => [optionName, { value }]),
      );

      this.particleEffects[id] = {
        type: flags[id].type,
        fx: new CONFIG.fxmaster.particleEffects[flags[id].type](this.particleEffectsContainer, options),
      };
      this.particleEffects[id].fx.play({ prewarm: !soft });
    }

    await stopPromise;

    if (Object.keys(this.particleEffects).length === 0) {
      this.particleEffectOcclusionFilter.enabled = false;
    }
  }

  /**
   * Create the occlusion filter.
   * @returns {InverseOcclusionMaskFilter} The occlusion filter
   * @private
   */
  #createParticleEffectOcclusionFilter() {
    const particleOcclusionFilter = InverseOcclusionMaskFilter.create({
      alphaOcclusion: 0,
      uMaskSampler: canvas.masks.tileOcclusion.renderTexture,
      channel: "b",
    });
    return particleOcclusionFilter;
  }
}
