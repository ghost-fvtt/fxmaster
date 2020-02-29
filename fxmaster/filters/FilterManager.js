class FilterManager {
    initialize() {
        this.filters = {
            AdjustmentFilter: new PIXI.filters.AdjustmentFilter,
            DizzyFilter: new DizzyFilter
        }
        canvas.background.filters = Object.values(this.filters);
        canvas.tiles.filters = Object.values(this.filters);
        canvas.effects.filters = Object.values(this.filters);
        canvas.tokens.filters = Object.values(this.filters);

        this.filterInfos = {};
        this.hardRefresh();
    }

    update() {
        let flags = canvas.scene.data.flags.fxmaster;
        if (flags && flags.filters) {
            this.filterInfos = flags.filters;
        } else {
            canvas.scene.setFlag("fxmaster", "filters", {});
        }
    }

    hardRefresh() {
        this.update();
        if (!this.filterInfos) return;
        Object.keys(this.filterInfos).forEach(f => {
            console.log(this.filters[f], this.filterInfos[f]);
            Object.assign(this.filters[f], this.filterInfos[f]);
        })
    }

    dump() {
        canvas.scene.setFlag("fxmaster", "filters", null).then(_ => {
            canvas.scene.setFlag("fxmaster", "filters", this.filterInfos);
        });
    }

    switchFilter(filter, options1, options2) {
        this.update();
        if (!this.filterInfos[filter]) this.filterInfos[filter] = {};
        Object.keys(options1).forEach((opt) => {
            if (this.filterInfos[filter][opt] !== options1[opt]) {
                this.filterInfos[filter][opt] = options1[opt];
            } else {
                this.filterInfos[filter][opt] = options2[opt];
            }
        });
        this.dump();
    }

    draw() {
        this.update();
        Object.keys(this.filterInfos).forEach((f) => {
            let anim = {
                ease: Linear.easeNone,
                repeat: 0
            }
            Object.assign(anim, this.filterInfos[f]);
            gsap.to(this.filters[f], 1, anim);
        })
    }
}

const filterManager = new FilterManager();