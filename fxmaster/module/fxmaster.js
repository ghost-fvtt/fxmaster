Hooks.once("init", function() {
  CONFIG.weatherEffects.bubbles = BubblesWeatherEffect;
  CONFIG.weatherEffects.clouds = CloudsWeatherEffect;
  CONFIG.weatherEffects.embers = EmbersWeatherEffect;
  CONFIG.weatherEffects.crows = CrowsWeatherEffect;
});

Hooks.once('canvasInit', (canvas) => {
  canvas.fxmaster = canvas.stage.addChildAt(new FXMasterLayer(canvas), 8);
  canvas.fxmaster.draw();
});

Hooks.on("updateScene", () => {
  canvas.fxmaster.draw();
});