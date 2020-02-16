Hooks.on('getSceneControlButtons', (controls) => {
    if (game.user.isGM) {
        controls.push({
            name: "effects",
            title: "CONTROLS.Effects",
            icon: "fas fa-magic",
            layer: 'FXMasterLayer',
            tools: [{
                name: "configure",
                title: "CONTROLS.Config",
                icon: "fas fa-cog",
                onClick: () => {
                    new EffectsConfig().render(true);
                }
            }]
        });
    }
});