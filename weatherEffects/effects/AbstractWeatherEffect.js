export class AbstractWeatherEffect extends SpecialEffect {
  static get parameters() {
    return {
      scale: {
        label: "FXMASTER.Scale",
        type: "range",
        callback: "setScale",
        default: 1,
        step: 0.1,
        min: 0,
        max: 10
      },
      direction: {
        label: "FXMASTER.Direction",
        type: "range",
        step: 10,
        max: 360,
        min: 0,
        callback: "setDirection",
        default: 0
      },
      speed: {
        label: "FXMASTER.Speed",
        type: "number",
        callback: "setSpeed",
        default: 10
      },
      density: {
        label: "FXMASTER.Density",
        type: "number",
        callback: "setDensity",
        default: 1
      },
      tint: {
        label: "FXMASTER.Tint",
        type: "color",
        callback: "setTint",
        default: {
          value: "#FFFFFF",
          apply: false
        }
      },
    }
  }

  static get default() {
    return Object.keys(this.parameters).reduce((def, key) => {
      def[key] = this.parameters[key].default;
      return def;
    }, {});
  }

  setSpeed(value) {
    for (const emitter of this.emitters) {
      // Keeping speed ratio between nodes

      // Getting max speed
      let maxSpeed = 0;

      let node = emitter.startSpeed;
      while (node) {
        maxSpeed = node.value > maxSpeed ? node.value : maxSpeed;
        node = node.next;
      }
      // Getting ratio to attain value at max speed
      const maxRatio = value / maxSpeed;
      
      node = emitter.startSpeed;
      while (node) {
        node.value *= maxRatio;
        node = node.next;
      }
    }
  }

  setScale(value) {
    for (const emitter of this.emitters) {
      let node = emitter.startScale;
      while (node) {
        node.value *= value;
        node = node.next;
      }
    }
  }

  setDensity(value) {
    this.options.density = value;
    for (const emitter of this.emitters) {
      const oldP = emitter.maxParticles;
      emitter.maxParticles = value;
      emitter.frequency *= value / oldP;
    }
  }

  setDirection(value) {
    this.options.direction = value;
    // Getting rotation span
    for (const emitter of this.emitters) {
      const span = emitter.maxStartRotation - emitter.minStartRotation;
      emitter.minStartRotation = value - span / 2;
      emitter.maxStartRotation = value + span / 2;
    }
  }

  setTint(tint) {
    if (!tint.apply) return;
    this.options.tint = tint;
    const value = tint.value;
    const colors = hexToRGB(colorStringToHex(value));
    for (const emitter of this.emitters) {
      let node = emitter.startColor;
      while (node) {
        node.value = {
          r: colors[0] * 255,
          g: colors[1] * 255,
          b: colors[2] * 255,
        };
        node = node.next;
      }
    }
  }
}