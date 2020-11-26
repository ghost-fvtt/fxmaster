
export const registerSettings = function () {
    game.settings.register("fxmaster", "enable", {
        name: game.i18n.localize("FXMASTER.Enable"),
        default: true,
        scope: "client",
        type: Boolean,
        config: true,
        onChange: _ => window.location.reload()
    });

    game.settings.register("fxmaster", "specialEffects", {
        name: "specialEffects",
        default: [],
        scope: "world",
        type: Array,
        config: false
    });

    game.settings.register("fxmaster", "migration", {
        name: "migration",
        default: [],
        scope: "world",
        type: Number,
        config: false
    });
}