import fog from "./shaders/fog.frag";
import customVertex2D from "./shaders/custom-vertex-2d.vert";
import { FadingFilterMixin } from "./mixins/fading-filter.js";

export class FogFilter extends FadingFilterMixin(PIXI.Filter) {
  constructor(options, id) {
    super(options, id, customVertex2D, fog);
    this.uniforms.time = 0.0;
    this.uniforms.dimensions = new Float32Array([0.0, 0.0]);
    this.uniforms.color = new Float32Array([0.0, 0.0, 0.0, 1.0]);
  }

  /** @type {number} */
  lastTick;

  /** @override */
  static label = "FXMASTER.FilterEffectFog";

  /** @override */
  static icon = "fas fa-cloud";

  /** @override */
  static get parameters() {
    return {
      dimensions: {
        label: "FXMASTER.Scale",
        type: "range",
        max: 5,
        min: 0,
        step: 0.1,
        value: 1,
        skipInitialAnimation: true,
      },
      speed: {
        label: "FXMASTER.Speed",
        type: "range",
        max: 5,
        min: 0,
        step: 0.1,
        value: 1,
        skipInitialAnimation: true,
      },
      density: {
        label: "FXMASTER.Density",
        type: "range",
        max: 1,
        min: 0,
        step: 0.05,
        value: 0.65,
      },
      color: {
        label: "FXMASTER.Tint",
        type: "color",
        value: {
          value: "#000000",
          apply: false,
        },
        skipInitialAnimation: true,
      },
    };
  }

  /** @override */
  static get neutral() {
    return {
      density: 0,
    };
  }

  /** @type {number} */
  get r() {
    return this.uniforms.color[0];
  }
  set r(value) {
    this.uniforms.color[0] = value;
  }

  /** @type {number} */
  get g() {
    return this.uniforms.color[1];
  }
  set g(value) {
    this.uniforms.color[1] = value;
  }

  /** @type {number} */
  get b() {
    return this.uniforms.color[2];
  }
  set b(value) {
    this.uniforms.color[2] = value;
  }

  /** @type {number} */
  get density() {
    return this.uniforms.density;
  }
  set density(value) {
    this.uniforms.density = value;
  }

  /** @type {number} */
  get dimensions() {
    return this.uniforms.dimensions[0];
  }
  set dimensions(value) {
    this.uniforms.dimensions[0] = this.uniforms.dimensions[1] = (value * 100) / (canvas?.dimensions?.size ?? 100);
  }

  /** @override */
  configure(options) {
    if (!options) {
      return;
    }
    const { color, ...otherOptions } = options;
    const { r, g, b } = foundry.utils.Color.from(color.apply ? color.value : 0x000000);
    super.configure({ ...otherOptions, r, g, b });
  }

  /** @override */
  play(options) {
    this.lastTick = canvas.app.ticker.lastTime;
    super.play(options);
  }

  /** @override */
  async step() {
    const delta = canvas.app.ticker.lastTime - this.lastTick;
    this.lastTick = canvas.app.ticker.lastTime;
    this.uniforms.time += delta * this.speed * 0.1;
    await super.step();
  }

  apply(filterManager, input, output, clear, currentState) {
    this.uniforms.filterMatrix ??= new PIXI.Matrix();
    this.uniforms.filterMatrix.copyFrom(currentState.target.worldTransform).invert();
    return super.apply(filterManager, input, output, clear, currentState);
  }
}
