Hooks.once("init", function () {
  CONFIG.weatherEffects.bubbles = BubblesWeatherEffect;
  CONFIG.weatherEffects.clouds = CloudsWeatherEffect;
  CONFIG.weatherEffects.embers = EmbersWeatherEffect;
  CONFIG.weatherEffects.crows = CrowsWeatherEffect;
  CONFIG.weatherEffects.fog = FogWeatherEffect;
});

Hooks.once('canvasInit', (canvas) => {
  filterManager.initialize();
  canvas.fxmaster = canvas.stage.addChildAt(new FXMasterLayer(canvas), 8);
});

Hooks.on('canvasReady', (_) => {
  if (game.user.isGM) {
    filterManager.hardRefresh();
  }
});

Hooks.on("updateScene", (scene, data, options) => {
  filterManager.draw();
  canvas.fxmaster.draw();
});