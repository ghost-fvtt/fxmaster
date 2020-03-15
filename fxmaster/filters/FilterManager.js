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
            this.filters[keys[i]] = new CONFIG.fxmaster.filters[this.filterInfos[keys[i]].type](this.filterInfos[keys[i]].options);
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
            this.filters[keys[i]] = new CONFIG.fxmaster.filters[this.filterInfos[keys[i]].type](this.filterInfos[keys[i]].options);
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

    addFilter(filter, options) {
        this.filterInfos[randomID()] = {
            type: filter,
            options: options
        };
        this.dump();
    }

    switch(filter, activate, opts) {
        const keys = Object.keys(this.filters);
        let count = 0;
        for (let i = 0; i < keys.length; ++i) {
            if (this.filterInfos[keys[i]] && this.filterInfos[keys[i]].type == filter) {
                count++;
                if (activate === true) {
                    this.filterInfos[keys[i]].options = opts;
                    this.dump();
                    count++;
                    continue;
                }
                this.filters[keys[i]].stop().then((_, res) => {
                    delete this.filters[keys[i]];
                });
                delete this.filterInfos[keys[i]];
                this.dump();
            }
        }
        if (count == 0 && (activate === true || activate === null)) {
            this.addFilter(filter, opts);
        }
    }
}

export const filterManager = new FilterManager();
