export class AbstractWeatherEffect extends SpecialEffect {
  static get parameters() {
    return {
      speed: {
        label: "FXMASTER.Speed",
        type: "number",
        callback: "setSpeed",
        default: 10
      },
      scale: {
        label: "FXMASTER.Scale",
        type: "number",
        callback: "setScale",
        default: 1
      },
      frequency: {
        label: "FXMASTER.Period",
        type: "number",
        callback: "setPeriod",
        default: 1
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
        default: "#FFFFFF"
      },
      direction: {
        label: "FXMASTER.Direction",
        type: "number",
        callback: "setDirection",
        default: 0
      }
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

  setPeriod(value) {
    for (const emitter of this.emitters) {
      emitter.frequency = value;
    }
  }

  setDensity(value) {
    for (const emitter of this.emitters) {
      emitter.maxParticles = value;
    }
  }

  setDirection(value) {
    // Getting rotation span
    for (const emitter of this.emitters) {
      const span = emitter.maxStartRotation - emitter.minStartRotation;
      emitter.minStartRotation = value - span / 2;
      emitter.maxStartRotation = value + span / 2;
    }
  }

  setLifetime(value) {
    // Getting rotation span
    for (const emitter of this.emitters) {
    }
  }

  setTint(value) {
    if (value == "#FFFFFF") return;
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