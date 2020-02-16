class FXMasterLayer extends PlaceablesLayer {

  /** @extends {PlaceablesLayer.layerOptions} */
  static get layerOptions() {
    return mergeObject(super.layerOptions, {
      canDragCreate: false
    });
  }

  /** @override */
  static get dataArray() {
    return "notes";
  }

  /** @override */
  static get placeableClass() {
    return Note;
  }

  /* -------------------------------------------- */
  /*  Methods
  /* -------------------------------------------- */

  /** @extends {PlaceablesLayer.activate} */
  activate() {
    super.activate();
  }

  /* -------------------------------------------- */

  async draw() {
    await super.draw()
    // Draw the weather layer
    this.drawWeather();
  }

  /* -------------------------------------------- */

  drawWeather() {
    if (!this.weather) this.weather = this.addChild(new PIXI.Container());
    if (!this.weatherEffects) this.weatherEffects = [];
    this.weatherEffects.forEach((effect, key) => {
      effect.fx.stop();
      this.weatherEffects.splice(key);
    });
    if (this.effects) {
      this.effects.forEach(effect => {
        console.log(effect);
        const weatherEffect = new effect.fx(this.weather);
        console.log(weatherEffect);
        weatherEffect.play();
        this.weatherEffects.push({scene: effect.scene, fx: weatherEffect});
      });
    }
  }

  /* -------------------------------------------- */

  /** @extends {PlaceablesLayer.deactivate} */
  deactivate() {
    super.deactivate();
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  _onMouseDown(event) { }

  /* -------------------------------------------- */

  /**
   * Handle JournalEntry entity drop data
   * @param {Event} event
   * @param {JournalEntry} entry
   * @private
   */
  _onDropEntity(event, entry) {
  }
}