import { roundToDecimals } from "../../utils.js";

export class AbstractWeatherEffect extends SpecialEffect {
  static get parameters() {
    return {
      scale: {
        label: "FXMASTER.Scale",
        type: "range",
        min: 0.1,
        value: 1,
        max: 5,
        step: 0.1,
        decimals: 1,
      },
      direction: {
        label: "FXMASTER.Direction",
        type: "range",
        min: 0,
        value: (this.CONFIG.startRotation.min + this.CONFIG.startRotation.min) / 2,
        max: 360,
        step: 10,
        decimals: 0,
      },
      speed: {
        label: "FXMASTER.Speed",
        type: "range",
        min: 0.1,
        value: 1,
        max: 5,
        step: 0.1,
        decimals: 1,
      },
      density: {
        label: "FXMASTER.Density",
        type: "range",
        min: 0.1,
        value: 0.5,
        max: 5,
        step: 0.1,
        decimals: 1,
      },
      tint: {
        label: "FXMASTER.Tint",
        type: "color",
        value: {
          value: "#FFFFFF",
          apply: false,
        },
      },
    };
  }

  static get default() {
    return Object.fromEntries(
      Object.entries(this.parameters).map(([parameterName, parameterConfig]) => [parameterName, parameterConfig.value]),
    );
  }

  /** @override */
  static get effectOptions() {
    const optionTypeMapping = {
      color: SpecialEffect.OPTION_TYPES.value,
      number: SpecialEffect.OPTION_TYPES.VALUE,
      range: SpecialEffect.OPTION_TYPES.RANGE,
    };
    return Object.fromEntries(
      Object.entries(this.parameters).map(([parameterName, parameterConfig]) => [
        parameterName,
        { ...parameterConfig, type: optionTypeMapping[parameterConfig.type] },
      ]),
    );
  }

  applyOptionsToConfig(config) {
    this._applyScaleToConfig(config);
    this._applySpeedToConfig(config);
    this._applyDirectionToConfig(config);
    this._applyTintToConfig(config);
  }

  /** @protected */
  _applyFactorToBasicTweenableOrValueListOrRandNumber(basicTweenableOrValueListOrRandNumber, factor) {
    if ("start" in basicTweenableOrValueListOrRandNumber) {
      basicTweenableOrValueListOrRandNumber.start = basicTweenableOrValueListOrRandNumber.start * factor;
    }
    if ("end" in basicTweenableOrValueListOrRandNumber) {
      basicTweenableOrValueListOrRandNumber.end = basicTweenableOrValueListOrRandNumber.end * factor;
    }
    if ("list" in basicTweenableOrValueListOrRandNumber) {
      basicTweenableOrValueListOrRandNumber.list = basicTweenableOrValueListOrRandNumber.list.map((valueStep) => ({
        ...valueStep,
        value: valueStep.value * factor,
      }));
    }
    if ("min" in basicTweenableOrValueListOrRandNumber) {
      basicTweenableOrValueListOrRandNumber.min = basicTweenableOrValueListOrRandNumber.min * factor;
    }
    if ("max" in basicTweenableOrValueListOrRandNumber) {
      basicTweenableOrValueListOrRandNumber.max = basicTweenableOrValueListOrRandNumber.max * factor;
    }
  }

  /** @protected */
  _applyScaleToConfig(config) {
    const scale = config.scale ?? {};
    const factor = (this.options.scale?.value ?? 1) * (canvas.dimensions.size / 100);
    this._applyFactorToBasicTweenableOrValueListOrRandNumber(scale, factor);
  }

  /** @protected */
  _applySpeedToConfig(config) {
    const factor = (this.options.speed?.value ?? 1) * (canvas.dimensions.size / 100);

    const speed = config.speed ?? {};
    this._applyFactorToBasicTweenableOrValueListOrRandNumber(speed, factor);

    const lifeTime = config.lifetime ?? {};
    this._applyFactorToBasicTweenableOrValueListOrRandNumber(lifeTime, 1 / factor);

    config.frequency /= factor;
  }

  /** @protected */
  _applyDirectionToConfig(config) {
    const direction = this.options.direction?.value;
    const range = (config.startRotation?.max ?? 0) - (config.startRotation?.min ?? 0);
    if (direction !== undefined) {
      config.startRotation = { min: direction - range / 2, max: direction + range / 2 };
    }
  }

  /** @protected */
  _applyTintToConfig(config) {
    if (this.options.tint?.value.apply) {
      const value = this.options.tint.value.value;
      config.color = {
        list: [
          { value, time: 0 },
          { value, time: 1 },
        ],
      };
    }
  }

  /**
   * Fade this effect out, playing it once and then stopping it.
   * @param {{timeout?: number}} [options]         Additional options to configure the fade out
   * @param {number}             [options.timeout] If given, the effect will be stopped after the given number in ms,
   *                                               regardless of if it has finished playing or not.
   * @returns {Promise<void>}                      A promise that resolves as soon as this effect has finished fading out
   */
  async fadeOut({ timeout } = {}) {
    const emitterPromises = this.emitters.map(
      (emitter) =>
        new Promise((resolve) => {
          emitter.emitterLifetime = 0.1;
          emitter.playOnceAndDestroy(() => {
            resolve();
          });
        }),
    );
    const promises = [Promise.all(emitterPromises)];
    if (timeout !== undefined) {
      promises.push(new Promise((resolve) => setTimeout(resolve, timeout)));
    }

    await Promise.race(promises);
    this.stop();
  }

  static convertOptionsToV2(options, scene) {
    return Object.fromEntries(
      Object.entries(options).map(([optionKey, optionValue]) => {
        switch (optionKey) {
          case "scale": {
            return [optionKey, this._convertScaleToV2(optionValue, scene)];
          }
          case "speed": {
            return [optionKey, this._convertSpeedToV2(optionValue, scene)];
          }
          case "density": {
            return [optionKey, this._convertDensityToV2(optionValue, scene)];
          }
          default: {
            return [optionKey, optionValue];
          }
        }
      }),
    );
  }

  /** @protected */
  static _convertScaleToV2(scale, scene) {
    const decimals = this.parameters.scale?.decimals ?? 1;
    return roundToDecimals(scale * (100 / scene.dimensions.size), decimals);
  }

  /** @protected */
  static _convertSpeedToV2(speed, scene) {
    const speeds = this.CONFIG.speed?.list?.map((valueStep) => valueStep.value) ?? [];
    if ("start" in (this.CONFIG.speed ?? {})) {
      speeds.push(this.CONFIG.speed.start);
    }
    if ("end" in (this.CONFIG.speed ?? {})) {
      speeds.push(this.CONFIG.speed.end);
    }
    const maximumSpeed = Math.max(...speeds);

    const decimals = this.parameters.speed?.decimals ?? 1;
    return roundToDecimals((speed / maximumSpeed) * (100 / scene.dimensions.size), decimals);
  }

  /** @protected */
  static _convertDensityToV2(density, scene) {
    const d = scene.dimensions;
    const gridUnits = (d.width / d.size) * (d.height / d.size);

    const decimals = this.parameters.density?.decimals ?? 1;
    return roundToDecimals(density / gridUnits, decimals);
  }
}
