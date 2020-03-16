class FilterManager {
  constructor() {
    this.filterInfos = {};
    this.filters = {};
  }

  activate() {
    const flags = canvas.scene.data.flags.fxmaster;
    if (flags && flags.filters) {
      this.filterInfos = flags.filters;
    }

    // create new effects
    const keys = Object.keys(this.filterInfos);
    for (let i = 0; i < keys.length; ++i) {
      this.filters[keys[i]] = new CONFIG.fxmaster.filters[
        this.filterInfos[keys[i]].type
      ](this.filterInfos[keys[i]].options);
      this.filters[keys[i]].skipFading = true;
      this.filters[keys[i]].play();
    }

    canvas.background.filters = Object.values(this.filters);
    canvas.tiles.filters = Object.values(this.filters);
    canvas.tokens.filters = Object.values(this.filters);
  }

  update() {
    const flags = canvas.scene.data.flags.fxmaster;
    if (flags && flags.filters) {
      this.filterInfos = flags.filters;
    }

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

    // create new effects
    const keys = Object.keys(this.filterInfos);
    for (let i = 0; i < keys.length; ++i) {
      if (this.filters[keys[i]]) {
        continue;
      }
      this.filters[keys[i]] = new CONFIG.fxmaster.filters[
        this.filterInfos[keys[i]].type
      ](this.filterInfos[keys[i]].options);
      this.filters[keys[i]].play();
    }

    canvas.background.filters = Object.values(this.filters);
    canvas.tiles.filters = Object.values(this.filters);
    canvas.tokens.filters = Object.values(this.filters);
  }

  dump() {
    canvas.scene.setFlag("fxmaster", "filters", null).then(_ => {
      canvas.scene.setFlag("fxmaster", "filters", this.filterInfos);
    });
  }

  clear() {
    const keys = Object.keys(this.filters);
    for (let i = 0; i < keys.length; ++i) {
      this.filters[keys[i]].skipFading = true;
      this.filters[keys[i]].stop().then((_, res) => {
        delete this.filters[keys[i]];
      });
    }
  }

  addFilter(name, filter, options) {
    if (!name) {
      name = randomID();
    }
    this.filterInfos[name] = {
      type: filter,
      options: options
    };
    this.dump();
  }

  removeFilter(name) {
    this.filters[name].stop().then((_, res) => {
      delete this.filters[name];
    });
    delete this.filterInfos[name];
    this.dump();
  }

  switch(name, filter, activate, opts) {
    if (this.filterInfos[name]) {
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
}

export const filterManager = new FilterManager();
