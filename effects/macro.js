function castSpell(effect) {
    const tokens = canvas.tokens.controlled;
    if (tokens.length == 0) {
        ui.notifications.error("Please select a token");
        return;
    }
    game.user.targets.forEach((i, t) => {
        canvas.fxmaster.drawSpecialToward(effect, tokens[0], t);
    })
}

castSpell({
    file: "modules/fxmaster/specials/jinker/dragonBornBlack-CopperAcid30x5Line.webm",
    anchor: {
        x: -.08,
        y: 0.5
    },
    speed: 0,
    angle: 0,
    scale: 1
});