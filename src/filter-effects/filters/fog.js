import fog from "./shaders/fog.frag";
import customVertex2D from "./shaders/custom-vertex-2d.vert";
import { FadingFilterMixin } from "./mixins/fading-filter.js";

const tempRect = new PIXI.Rectangle();

export class FogFilter extends FadingFilterMixin(PIXI.Filter) {
  constructor(options, id) {
    super(options, id, customVertex2D, fog);
    this.boundsPadding = new PIXI.Point(0, 0);
    if (!this.uniforms.filterMatrix) {
      this.uniforms.filterMatrix = new PIXI.Matrix();
    }
    this.uniforms.time = 0.0;
    this.uniforms.dimensions = new Float32Array([0.5, 0.5]);
    this.uniforms.color = new Float32Array([0.0, 0.0, 0.0, 1.0]);
  }

  /** @override */
  static label = "FXMASTER.FilterEffectFog";

  /** @override */
  static icon = "fas fa-cloud";

  /** @override */
  static get parameters() {
    return {
      density: {
        label: "FXMASTER.Density",
        type: "range",
        max: 1,
        min: 0,
        step: 0.05,
        value: 0.65,
      },
      speed: {
        label: "FXMASTER.Speed",
        type: "range",
        max: 2,
        min: 0,
        step: 0.01,
        value: 0.1,
      },
      color: {
        label: "FXMASTER.Tint",
        type: "color",
        value: {
          value: "#000000",
          apply: false,
        },
      },
      dimensions: {
        label: "FXMASTER.Scale",
        type: "range",
        max: 5,
        min: 0,
        step: 0.1,
        value: 0.5,
      },
    };
  }

  /** @override */
  static get neutral() {
    return {
      density: 0,
    };
  }

  /** @type number */
  get r() {
    return this.uniforms.color[0];
  }
  set r(value) {
    this.uniforms.color[0] = value;
  }

  /** @type number */
  get g() {
    return this.uniforms.color[1];
  }
  set g(value) {
    this.uniforms.color[1] = value;
  }

  /** @type number */
  get b() {
    return this.uniforms.color[2];
  }
  set b(value) {
    this.uniforms.color[2] = value;
  }

  /** @type number */
  get density() {
    return this.uniforms.density;
  }
  set density(value) {
    this.uniforms.density = value;
  }

  /** @type number */
  get dimensions() {
    return this.uniforms.dimensions[0];
  }
  set dimensions(value) {
    this.uniforms.dimensions[0] = this.uniforms.dimensions[1] = value;
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
  async step() {
    this.uniforms.time = canvas.app.ticker.lastTime * 0.0;
    await super.step();
  }

  apply(filterManager, input, output, clear) {
    const filterMatrix = this.uniforms.filterMatrix;

    if (filterMatrix) {
      const { sourceFrame, destinationFrame, target } = filterManager.activeState;

      filterMatrix.set(destinationFrame.width, 0, 0, destinationFrame.height, sourceFrame.x, sourceFrame.y);

      const worldTransform = PIXI.Matrix.TEMP_MATRIX;

      const localBounds = target.getLocalBounds(tempRect);

      const transform = target.transform.localTransform;
      worldTransform.a = transform.scale.x;
      worldTransform.b = 0;
      worldTransform.c = 0;
      worldTransform.d = transform.scale.y;
      worldTransform.tx = transform.position.x - transform.pivot.x * transform.scale.x;
      worldTransform.ty = transform.position.y - transform.pivot.y * transform.scale.y;
      worldTransform.prepend(target.parent.transform.worldTransform);
      worldTransform.invert();

      const scaleX = Math.hypot(worldTransform.a, worldTransform.b);
      const scaleY = Math.hypot(worldTransform.c, worldTransform.d);

      localBounds.pad(scaleX * this.boundsPadding.x, scaleY * this.boundsPadding.y);

      filterMatrix.prepend(worldTransform);
      filterMatrix.translate(-localBounds.x, -localBounds.y);
      filterMatrix.scale(1.0 / localBounds.width, 1.0 / localBounds.height);
    }

    filterManager.applyFilter(this, input, output, clear);
  }
}
