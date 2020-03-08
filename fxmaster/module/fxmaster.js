Hooks.once("init", function () {
  CONFIG.weatherEffects.bubbles = BubblesWeatherEffect;
  CONFIG.weatherEffects.clouds = CloudsWeatherEffect;
  CONFIG.weatherEffects.embers = EmbersWeatherEffect;
  CONFIG.weatherEffects.crows = CrowsWeatherEffect;
  CONFIG.weatherEffects.bats = BatsWeatherEffect;
  CONFIG.weatherEffects.fog = FogWeatherEffect;
  CONFIG.weatherEffects.raintop = RaintopWeatherEffect;
});

Hooks.once('canvasInit', (canvas) => {
  // filterManager.initialize();
  canvas.fxmaster = canvas.stage.addChildAt(new FXMasterLayer(canvas), 8);
  console.log("Canvas Init");
});

Hooks.on('canvasReady', (_) => {
  // filterManager.hardRefresh();
  canvas.fxmaster.updateMask();
  canvas.fxmaster.drawWeather();
  console.log("Canvas Ready");
});

Hooks.on("updateScene", (scene, data, options) => {
  canvas.fxmaster.updateMask();
  if (hasProperty(data, "flags.fxmaster.filters")) {
    // filterManager.draw();
  }
  if (hasProperty(data, "flags.fxmaster.effects")) {
    canvas.fxmaster.drawWeather();
  }
});