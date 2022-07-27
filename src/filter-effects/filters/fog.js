import { fog } from "./shaders/fog.js";
import { customVertex2D } from "./shaders/customvertex2D.js";
import { FXMasterFilterEffectMixin } from "./mixins/filter.js";

export class FogFilter extends FXMasterFilterEffectMixin(PIXI.Filter) {
  constructor(options, id) {
    super(options, id, customVertex2D, fog);
    this.color = new Float32Array([1.0, 0.4, 0.1, 0.55]);
    this.dimensions = new Float32Array([1.0, 1.0]);
    this.time = 0.0;
    this.density = 0.65;
  }

  /** @override */
  static label = "FXMASTER.FilterEffectFog";

  /** @override */
  static icon = "fas fa-cloud";

  apply(filterManager, input, output, clear) {
    this.uniforms.color = this.color;
    this.uniforms.dimensions = this.dimensions;
    this.uniforms.time = this.time;
    this.uniforms.density = this.density;
    this.uniforms.dimensions = this.dimensions;

    filterManager.applyFilter(this, input, output, clear);
  }

  /** @override */
  static get parameters() {
    return {};
  }

  /** @override */
  static get neutral() {
    return {};
  }

  /** @override */
  async step() {
    this.time = canvas.app.ticker.lastTime;
    await super.step();
  }
}
