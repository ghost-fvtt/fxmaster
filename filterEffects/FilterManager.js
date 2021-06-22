import { resetFlags } from "../module/utils.js";

class FilterManager {
  constructor() {
    this.filterInfos = {};
    this.filters = {};
    this._ticker = false;
  }

  activate() {
    this.filterInfos = canvas.scene.getFlag("fxmaster", "filters");
    this.filterInfos = this.filterInfos || {};

    // Creating new filters from filterInfos
    this.filters = Object.keys(this.filterInfos).reduce((filters, key) => {
      const info = this.filterInfos[key];
      if (!CONFIG.fxmaster?.filters[info?.type]) return;
      filters[key] = new CONFIG.fxmaster.filters[info.type](info.options);
      filters[key].skipFading = true;
      filters[key].play();
      return filters;
    }, this.filters);

    this.filters = this.filters || {};
    canvas.background.filters = [...Object.values(this.filters)];
    canvas.foreground.filters = [...Object.values(this.filters)];
    canvas.tokens.filters = [...Object.values(this.filters)];
    
    if (!this._ticker) {
      canvas.app.ticker.add(this._animate, this);
      this._ticker = true;
    }
  }

  async update() {
    this.filterInfos = canvas.scene.getFlag("fxmaster", "filters");
    this.filterInfos = this.filterInfos || {};

    // Clear unused effects
    const deletePromises = [];
    for (const key in this.filters) {
      if (this.filterInfos[key]) {
        this.filters[key].configure(this.filterInfos[key].options);
        this.filters[key].play();
        continue;
      }
      
      const promise = this.filters[key].stop().then(() => {
        delete canvas.background.filters[key];
        delete canvas.foreground.filters[key];
        delete canvas.tokens.filters[key];
        delete this.filters[key];
      });
      deletePromises.push(promise);
    }
    await Promise.all(deletePromises);

    if (this.filterInfos) {
      // Creating new filters
      for (const key in this.filterInfos) {
        if (this.filters[key] || !CONFIG.fxmaster.filters[this.filterInfos[key].type]) {
          continue;
        }
        this.filters[key] = new CONFIG.fxmaster.filters[this.filterInfos[key].type](this.filterInfos[key].options);
        this.filters[key].play();
      }
    }
    canvas.background.filters = [...Object.values(this.filters)];
    canvas.foreground.filters = [...Object.values(this.filters)];
    canvas.tokens.filters = [...Object.values(this.filters)];
  }

  dump() {
    return resetFlags(canvas.scene, "filters", this.filterInfos);
  }

  clear() {
    const keys = Object.keys(this.filters);
    const promises = [];
    for (const key of keys) {
      promises.push(this.filters[key].stop());
    }
    this.filters = {};
    return Promise.all(promises);
  }

  addFilter(name, filter, options) {
    name = name || randomID();
    this.filterInfos = this.filterInfos || {};
    this.filterInfos[name] = {
      type: filter,
      options: options
    };
    return this.dump();
  }

  removeFilter(name) {
    if (this.filters[name] === undefined) return;
    return new Promise((resolve) => {
      this.filters[name].stop().then(() => {
        const rmFilter = {};
        rmFilter[`-=${name}`] = null;
        canvas.scene.setFlag("fxmaster", "filters", rmFilter).then(() => {
          resolve();
        });
      });
    });
  }

  async removeAll() {
    if (!this.filters || !this.filterInfos) return;
    const keys = Object.keys(this.filters);
    const promises = [];
    for (const key of keys) {
      promises.push(this.filters[key].stop());
    }
    await Promise.all(promises);
    this.filterInfos = {};
    return canvas.scene.unsetFlag("fxmaster", "filters");
  }

  switch(name, filter, opts) {
    if (this.filterInfos[name]) {
      return this.removeFilter(name);
    }
    return this.addFilter(name, filter, opts);
  }

  _animate() {
    for (const key in this.filters) {
      this.filters[key].step();
    }
  }
}

export const filterManager = new FilterManager();
