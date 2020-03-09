Hooks.once("init", function () {
  mergeObject(CONFIG.weatherEffects, {
    bubbles: BubblesWeatherEffect,
    clouds: CloudsWeatherEffect,
    embers: EmbersWeatherEffect,
    crows: CrowsWeatherEffect,
    bats: BatsWeatherEffect,
    fog: FogWeatherEffect,
    raintop: RaintopWeatherEffect
  });
});

Hooks.once('canvasInit', (canvas) => {
  canvas.fxmaster = canvas.stage.addChildAt(new FXMasterLayer(canvas), 8);
});

Hooks.on('canvasReady', (_) => {
  // filterManager.apply();
  canvas.fxmaster.updateMask();
  canvas.fxmaster.drawWeather();
});

Hooks.on("updateScene", (scene, data, options) => {
  canvas.fxmaster.updateMask();
  canvas.fxmaster.drawWeather();
  // if (hasProperty(data, "flags.fxmaster.filters")) {
    // filterManager.update();
  // }
});