import { packageId } from "../constants.js";
import { libWrapper } from "../shims/lib-wrapper.js";
import { SpecialsLayer } from "../specialEffects/SpecialsLayer.js";

export function registerCanvasWrappers() {
  const methods = ["_onClickLeft", "_onDragLeftStart", "_onDragLeftMove", "_onDragLeftDrop"];
  for (const method of methods) {
    libWrapper.register(packageId, `Canvas.prototype.${method}`, getWrapper(method), "WRAPPER");
  }
}

function getWrapper(method) {
  return function (wrapped, ...args) {
    wrapped.call(this, ...args);
    const layer = this.activeLayer;
    if (layer instanceof SpecialsLayer) layer[method](...args);
  };
}
