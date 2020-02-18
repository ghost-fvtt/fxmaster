Hooks.once("init", function() {
  CONFIG.weatherEffects.bubbles = BubblesWeatherEffect;
  CONFIG.weatherEffects.clouds = CloudsWeatherEffect;
  CONFIG.weatherEffects.embers = EmbersWeatherEffect;
  CONFIG.weatherEffects.crows = CrowsWeatherEffect;
  CONFIG.weatherEffects.fog = FogWeatherEffect;
});

Hooks.once('canvasInit', (canvas) => {
  // FilterManager.initialize();
  // FilterManager.update();
  canvas.fxmaster = canvas.stage.addChildAt(new FXMasterLayer(canvas), 8);
});

Hooks.on("updateScene", () => {
  canvas.fxmaster.draw();
  // FilterManager.update();
});