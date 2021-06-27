import { resetFlags } from "../module/utils.js";

class FilterManager {
  constructor() {
    this.filterInfos = {};
    this.filters = {};
    this._ticker = false;
    this.apply_to = {
      background: true,
      foreground: true,
      drawings: true,
      tokens: true
    }
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

    this.apply_to = canvas.scene.getFlag("fxmaster", "filteredLayers") || {};
    Object.keys(this.apply_to).forEach((k) => {
      if (this.apply_to[k]) {
        canvas[k].filters = [...Object.values(this.filters)];
      } else {
        canvas[k].filters = {};
      }
    })

    if (!this._ticker) {
      canvas.app.ticker.add(this._animate, this);
      this._ticker = true;
    }
  }

  async update() {
    this.filterInfos = canvas.scene.getFlag("fxmaster", "filters");
    this.filterInfos = this.filterInfos || {};
    this.apply_to = canvas.scene.getFlag("fxmaster", "filteredLayers") || {};

    // Clear unused effects
    const deletePromises = [];
    for (const key in this.filters) {
      if (this.filterInfos[key]) {
        this.filters[key].configure(this.filterInfos[key].options);
        this.filters[key].play();
        continue;
      }

      const promise = this.filters[key].stop().then(() => {
        if (canvas.background.filters[key]) delete canvas.background.filters[key];
        if (canvas.foreground.filters[key]) delete canvas.foreground.filters[key];
        if (canvas.drawings.filters[key]) delete canvas.drawings.filters[key];
        if (canvas.tokens.filters[key]) delete canvas.tokens.filters[key];
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
    this.filters = this.filters || {};
    this.apply_to = canvas.scene.getFlag("fxmaster", "filteredLayers") || {};
    Object.keys(this.apply_to).forEach((k) => {
      if (this.apply_to[k]) {
        canvas[k].filters = [...Object.values(this.filters)];
      }
      else {
        canvas[k].filters = {};
      }
    })
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
