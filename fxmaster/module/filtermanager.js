class FilterManager {
    static initialize() {
        canvas.stage.filters = [];
        this.filters = [];
        this.activeFilters = [];
    }

    static addFilter(filt, opts) {
        this.filters.push({ filter: filt, options: opts });
    }

    static removeFilter(filter) {
        for (let i = 0; i < this.filters.length; ++i) {
            if (this.filters[i].filter == filter) {
                this.filters.splice(i);
                return true;
            }
        }
        return false;
    }

    static switchFilter(filter, options) {
        if (!this.removeFilter(filter)) {
            this.addFilter(filter, options);
        }
        canvas.scene.update({ "flags.fxmaster.filters": this.filters });
    }

    static update() {
        let saved_filters = canvas.scene.data.flags.fxmaster.filters;
        canvas.stage.filters = [];
        for (let i = 0; i < saved_filters.length; ++i) {
            switch (saved_filters[i].filter) {
                case "AdjustmentFilter":
                    canvas.stage.filters.push(new PIXI.filters.AdjustmentFilter(saved_filters[i].options));
                    break;
                default:
                    break;
            }
        }
    }
}
