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
      },
      direction: {
        label: "FXMASTER.Direction",
        type: "range",
        min: 0,
        value: (this.CONFIG.startRotation.min + this.CONFIG.startRotation.min) / 2,
        max: 360,
        step: 10,
      },
      speed: {
        label: "FXMASTER.Speed",
        type: "range",
        min: 0.1,
        value: 1,
        max: 5,
        step: 0.1,
      },
      density: {
        label: "FXMASTER.Density",
        type: "range",
        min: 0.1,
        value: 0.5,
        max: 5,
        step: 0.1,
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
    this.applyScaleToConfig(config);
    this.applySpeedToConfig(config);
    this.applyDirectionToConfig(config);
    this.applyTintToConfig(config);
  }

  applyScaleToConfig(config) {
    const scale = config.scale ?? {};
    if ("start" in scale) {
      scale.start = scale.start * this.options.scale.value;
    }
    if ("end" in scale) {
      scale.end = scale.end * this.options.scale.value;
    }
    if ("list" in scale) {
      scale.list = scale.list.map((valueStep) => ({ ...valueStep, value: valueStep.value * this.options.scale.value }));
    }
  }

  applySpeedToConfig(config) {
    const speed = config.speed ?? {};
    if ("start" in speed) {
      speed.start = speed.start * this.options.speed.value;
    }
    if ("end" in speed) {
      speed.end = speed.end * this.options.speed.value;
    }
    if ("list" in speed) {
      speed.list = speed.list.map((valueStep) => ({ ...valueStep, value: valueStep.value * this.options.speed.value }));
    }
  }

  applyDirectionToConfig(config) {
    const direction = this.options.direction?.value;
    const range = (config.startRotation?.max ?? 0) - (config.startRotation?.min ?? 0);
    if (direction !== undefined) {
      config.startRotation = { min: direction - range / 2, max: direction + range / 2 };
    }
  }

  applyTintToConfig(config) {
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

  static convertOptionsToV2(options) {
    return Object.fromEntries(
      Object.entries(options).map(([optionKey, optionValue]) => {
        switch (optionKey) {
          case "density": {
            return [optionKey, this._convertDensityToV2(optionValue, canvas.scene)];
          }
          case "speed": {
            return [optionKey, this._convertSpeedToV2(optionValue)];
          }
          default: {
            return [optionKey, optionValue];
          }
        }
      }),
    );
  }

  /** @protected */
  static _convertSpeedToV2(speed) {
    const speeds = this.CONFIG.speed?.list?.map((valueStep) => valueStep.value) ?? [];
    if ("start" in (this.CONFIG.speed ?? {})) {
      speeds.push(this.CONFIG.speed.start);
    }
    if ("end" in (this.CONFIG.speed ?? {})) {
      speeds.push(this.CONFIG.speed.end);
    }
    const maximumSpeed = Math.max(...speeds);
    return speed / maximumSpeed;
  }

  /** @protected */
  static _convertDensityToV2(density, scene) {
    const d = scene.dimensions;
    const gridUnits = (d.width / d.size) * (d.height / d.size);
    return density / gridUnits;
  }
}
