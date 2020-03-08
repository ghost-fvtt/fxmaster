class FilterManager {
    constructor() {
        this.filters = {
            DizzyFilter: new DizzyFilter
        }
    }

    apply() {
        const keys = Object.keys(this.filters);
        for (let i = 0; i < keys.length; ++i) {
            this.filters[keys[i]].apply();
        }
        // canvas.background.filters = Object.values(this.filters);
        // canvas.tiles.filters = Object.values(this.filters);
        // canvas.effects.filters = Object.values(this.filters);
        // canvas.tokens.filters = Object.values(this.filters);
    }

    update() {
        // const flags = canvas.scene.data.flags.fxmaster;
        // if (flags && flags.filters) {
        //     this.filterInfos = flags.filters;
        // } else if (game.user.isGM) {
        //     canvas.scene.setFlag("fxmaster", "filters", {});
        // }
        const keys = Object.keys(this.filters);
        for (let i = 0; i < keys.length; ++i) {
            this.filters[keys[i]].update();
        }
    }

    hardRefresh() {
        this.update();
        if (!this.filterInfos) return;
        const keys = Object.keys(this.filterInfos);
        for (let i = 0; i < keys.length; ++i) {
            Object.assign(this.filters[keys[i]], this.filterInfos[keys[i]]);
        }
    }

    dump() {
        canvas.scene.setFlag("fxmaster", "filters", null).then(_ => {
            canvas.scene.setFlag("fxmaster", "filters", this.filterInfos);
        });
    }

    switch(filter) {
        this.filters[filter].switch();
    }
}

// const filterManager = new FilterManager();