export function registerSceneMaskFunctionality() {
  Hooks.on("canvasReady", drawSceneMask);
}

function drawSceneMask() {
  const msk = canvas.masks.depth;
  if (shouldMaskToScene()) {
    const mask = new PIXI.LegacyGraphics()
      .beginFill(0x0000ff)
      .drawShape(canvas.dimensions.rect)
      .endFill()
      .beginHole()
      .drawShape(canvas.dimensions.sceneRect.intersection(canvas.dimensions.rect))
      .endHole();
    mask.mask = new PIXI.MaskData();
    mask.mask.colorMask = PIXI.COLOR_MASK_BITS.BLUE;
    msk.fxmasterSceneMask = msk.addChild(mask);
  } else if (msk.fxmasterSceneMask) {
    msk.removeChild(msk.fxmasterSceneMask);
    delete msk.fxmasterSceneMask;
  }
}

/**
 * Whether or not the particle effects should be masked to the scene.
 * @type {boolean}
 */
function shouldMaskToScene() {
  return !!(canvas.scene?.background?.src || canvas.scene?.foreground);
}
