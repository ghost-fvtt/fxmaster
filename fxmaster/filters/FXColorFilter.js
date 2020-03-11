export class FXColorFilter extends PIXI.filters.AdjustmentFilter {
    constructor(options) {
        super();
        this.green = 1.2;
        this.blue = 0.8;
        this.red = 0.8;
        this.enabled = false;
        this.play();
    }

    static get label() {
        return "Color";
    }

    play() {
        this.enabled = true;
    }

    configure(opts) {
    }

    // So we can destroy object afterwards
    stop() {
        return new Promise((resolve, reject) => {
            this.enabled = false;
            resolve();
        });
    }
}