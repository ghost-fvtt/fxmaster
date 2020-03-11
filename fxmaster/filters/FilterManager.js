class FilterManager {
    constructor() {
        this.filters = {}
    }

    activate() {
        this.update();
    }

    addFilter(filter, options) {
        this.filterInfos[randomID()] = {
            type: filter,
            options: options
        };
        this.dump();
    }

    update() {
        const flags = canvas.scene.data.flags.fxmaster;
        if (flags && flags.filters) {
            this.filterInfos = flags.filters;
        } else if (game.user.isGM) {
            canvas.scene.setFlag("fxmaster", "filters", {});
        }
        const keys = Object.keys(this.filterInfos);
        for (let i = 0; i < keys.length; ++i) {
            if (this.filters[keys[i]]) {
                continue;
            }
            this.filters[keys[i]] = new CONFIG.fxmaster.filters[this.filterInfos[keys[i]].type](this.filterInfos[keys[i]].options);
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
            this.filters[keys[i]].stop().then((_, res) => {
                delete this.filters[keys[i]];
            });
        }
    }

    switch(filter) {
        const keys = Object.keys(this.filters);
        for (let i = 0; i < keys.length; ++i) {
            console.log(this.filters[keys[i]]);
            if (this.filterInfos[keys[i]].type == filter) {
                delete this.filterInfos[keys[i]];
                this.filters[keys[i]].stop().then((_, res) => {
                    delete this.filters[keys[i]];
                });
                return;
            }
        }
        this.addFilter(filter, {});
    }
}

const filterManager = new FilterManager();