class FilterManager {
  constructor() {
    this.filterInfos = {};
    this.filters = {};
    this._ticker = false;
  }

  activate() {
    this.filterInfos = canvas.scene.getFlag("fxmaster", "filters");
    if (!this.filterInfos) this.filterInfos = {};

    // create new effects
    const keys = Object.keys(this.filterInfos);
    for (let i = 0; i < keys.length; ++i) {
      if (!CONFIG.fxmaster.filters[this.filterInfos[keys[i]].type]) continue;
      this.filters[keys[i]] = new CONFIG.fxmaster.filters[
        this.filterInfos[keys[i]].type
      ](this.filterInfos[keys[i]].options);
      this.filters[keys[i]].skipFading = true;
      this.filters[keys[i]].play();
    }

    canvas.background.filters = Object.values(this.filters);
    canvas.foreground.filters = Object.values(this.filters);
    canvas.tokens.filters = Object.values(this.filters);
    if (!this._ticker) {
      canvas.app.ticker.add(this._animate, this);
      this._ticker = true;
    }
  }

  update() {
    this.filterInfos = canvas.scene.getFlag("fxmaster", "filters");
    if (!this.filterInfos) this.filterInfos = {};

    // Clear unused effects
    const effkeys = Object.keys(this.filters);
    for (let i = 0; i < effkeys.length; ++i) {
      if (this.filterInfos[effkeys[i]]) {
        this.filters[effkeys[i]].options = this.filterInfos[effkeys[i]].options;
        this.filters[effkeys[i]].play();
        continue;
      }
      this.filters[effkeys[i]].stop().then((_, res) => {
        delete this.filters[effkeys[i]];
      });
    }

    if (this.filterInfos) {
      // create new effects
      const keys = Object.keys(this.filterInfos);
      for (let i = 0; i < keys.length; ++i) {
        if (
          this.filters[keys[i]] ||
          !CONFIG.fxmaster.filters[this.filterInfos[keys[i]].type]
        ) {
          continue;
        }
        this.filters[keys[i]] = new CONFIG.fxmaster.filters[
          this.filterInfos[keys[i]].type
        ](this.filterInfos[keys[i]].options);
        this.filters[keys[i]].play();
      }
    }

    canvas.background.filters = Object.values(this.filters);
    canvas.foreground.filters = Object.values(this.filters);
    canvas.tokens.filters = Object.values(this.filters);
  }

  dump() {
    let newFilters = duplicate(this.filterInfos);
    canvas.scene.setFlag("fxmaster", "filters", null).then(_ => {
      canvas.scene.setFlag("fxmaster", "filters", newFilters);
    });
  }

  clear() {
    const keys = Object.keys(this.filters);
    for (let i = 0; i < keys.length; ++i) {
      this.filters[keys[i]].skipFading = true;
      this.filters[keys[i]].stop().then(_ => {
        delete this.filters[keys[i]];
      });
    }
  }

  addFilter(name, filter, options) {
    if (!name) {
      name = randomID();
    }
    if (!this.filterInfos) this.filterInfos = {};
    this.filterInfos[name] = {
      type: filter,
      options: options
    };
    this.dump();
  }

  removeFilter(name) {
    if (!this.filters[name]) return;
    this.filters[name].stop().then((_, res) => {
      delete this.filters[name];
    });
    delete this.filterInfos[name];
    this.dump();
  }

  removeAll() {
    if (!this.filters || !this.filterInfos) return;
    let keys = Object.keys(this.filters);
    for (let i = 0; i < keys.length; ++i) {
      this.filters[keys[i]].stop().then((_, res) => {
        delete this.filters[keys[i]];
      });
      delete this.filterInfos[keys[i]];
    }
    this.dump();
  }

  switch(name, filter, activate, opts) {
    if (this.filterInfos && hasProperty(this.filterInfos, name)) {
      if (activate == true) {
        this.filterInfos[name].options = opts;
        this.dump();
        return;
      }
      this.removeFilter(name);
    } else if (activate == true || activate == null) {
      this.addFilter(name, filter, opts);
    }
  }

  _animate() {
    const keys = Object.keys(this.filters);
    for (let i = 0; i < keys.length; i++) {
      this.filters[keys[i]].step();
    }
  }
}

export const filterManager = new FilterManager();
