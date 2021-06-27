import { fog } from "./shaders/fog.js";
import { customVertex2D } from "./shaders/customvertex2D.js"

export class FXFogFilter extends PIXI.Filter {
    constructor(options) {
        super(customVertex2D, fog);
        this.enabled = false;
        this.skipFading = false;

        this.color = new Float32Array([1.0, 0.4, 0.1, 0.55]);
        this.dimensions = new Float32Array([1.0, 1.0]);
        this.time = 0.0;
        this.density = 0.65;

        this.configure(options);
    }

    apply(filterManager, input, output, clear) {
        this.uniforms.color = this.color;
        this.uniforms.dimensions = this.dimensions;
        this.uniforms.time = this.time;
        this.uniforms.density = this.density;
        this.uniforms.dimensions = this.dimensions;

        filterManager.applyFilter(this, input, output, clear);
    }

    static get label() {
        return "Fog";
    }

    static get faIcon() {
        return "fas fa-cloud";
    }

    static get parameters() {
        return {}
    }

    static get zeros() {
        return {}
    }

    static get default() {
        return Object.keys(this.parameters).reduce((def, key) => {
            def[key] = this.parameters[key].default;
            return def;
        }, {});
    }

    configure(opts) {
        this.options = { ...this.constructor.default, ...opts };
    }

    applyOptions(opts = this.options) {
        if (!opts) return;
        const keys = Object.keys(opts);
        for (const key of keys) {
            this[key] = opts[key];
        }
    }

    step() {
        this.time = canvas.app.ticker.lastTime;
    }

    play() {
        this.enabled = true;
        this.applyOptions();
        return;
    }

    // So we can destroy object afterwards
    stop() {
        return new Promise((resolve, reject) => {
            this.enabled = false;
            this.applyOptions(this.constructor.zeros);
            resolve();
        });
    }
}
