Hooks.once("init", function () {
  // Adding custom weather effects
  mergeObject(CONFIG.weatherEffects, {
    bubbles: BubblesWeatherEffect,
    clouds: CloudsWeatherEffect,
    embers: EmbersWeatherEffect,
    crows: CrowsWeatherEffect,
    bats: BatsWeatherEffect,
    fog: FogWeatherEffect,
    raintop: RaintopWeatherEffect
  });

  // Adding filters
  if (!CONFIG.fxmaster) CONFIG.fxmaster = {};
  mergeObject(CONFIG.fxmaster, {
    filters: {
      dizzy: FXDizzyFilter
    }
  });
});

Hooks.once('canvasInit', (canvas) => {
  canvas.fxmaster = canvas.stage.addChildAt(new FXMasterLayer(canvas), 8);
});

Hooks.on('canvasInit', canvas => {
  filterManager.clear();
});

Hooks.on('canvasReady', (_) => {
  filterManager.activate();
  canvas.fxmaster.updateMask();
  canvas.fxmaster.drawWeather();
});

Hooks.on("updateScene", (scene, data, options) => {
  canvas.fxmaster.updateMask();
  canvas.fxmaster.drawWeather();
  filterManager.update();
});