class FilterManager {
    initialize() {
        canvas.stage.filters = [];
        this.filterInfos = {};
        this.filters = {};
        let flags = canvas.scene.data.flags.fxmaster;
        if (flags && flags.filters) {
            this.filterInfos = flags.filters;
        }
        this.draw();
    }

    addFilter(filt, opts) {
        let filterInfos = {};
        if (canvas.scene.data.flags.fxmaster && canvas.scene.data.flags.fxmaster)
            filterInfos = canvas.scene.data.flags.fxmaster.filters;
        filterInfos[filt] = opts;
        canvas.scene.update({ "flags.fxmaster.filters": null }).then(_ => {
            canvas.scene.update({ "flags.fxmaster.filters": filterInfos });
        });
    }

    removeFilter(filter) {
        let filterInfos = {};
        if (canvas.scene.data.flags.fxmaster && canvas.scene.data.flags.fxmaster)
            filterInfos = canvas.scene.data.flags.fxmaster.filters;
        if (filterInfos && filterInfos[filter]) {
            delete filterInfos[filter];
            canvas.scene.update({ "flags.fxmaster.filters": null }).then(_ => {
                canvas.scene.update({ "flags.fxmaster.filters": filterInfos });
            });
            return true;
        }
        return false;
    }

    switchFilter(filter, options) {
        if (!this.removeFilter(filter)) {
            this.addFilter(filter, options);
        }
    }

    draw() {
        if (!canvas.scene.data.flags.fxmaster || !canvas.scene.data.flags.fxmaster.filters)
            return;
        let saved_filters = canvas.scene.data.flags.fxmaster.filters;

        const filterMap =
        {
            "AdjustmentFilter": PIXI.filters.AdjustmentFilter
        };

        // Remove unused
        Object.keys(this.filters).forEach(f => {
            if (!saved_filters[f])
                delete this.filters[f];
        });

        // Add new
        Object.keys(saved_filters).forEach(f => {
            if (filterMap[f]) {
                if (!this.filters[f])
                    this.filters[f] = new filterMap[f](saved_filters[f]);
            }
        });
        
        canvas.stage.filters = Object.values(this.filters);
    }
}

const filterManager = new FilterManager();