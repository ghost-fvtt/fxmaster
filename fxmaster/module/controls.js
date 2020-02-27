Hooks.on('getSceneControlButtons', (controls) => {
    if (game.user.isGM) {
        controls.push({
            name: "effects",
            title: "CONTROLS.Effects",
            icon: "fas fa-magic",
            layer: 'FXMasterLayer',
            tools: [
                {
                    name: "weather",
                    title: "CONTROLS.Weather",
                    icon: "fas fa-cloud-rain",
                    onClick: () => {
                        new EffectsConfig().render(true);
                    }
                },
                {
                    name: "filters",
                    title: "CONTROLS.Filters",
                    icon: "fas fa-moon",
                    onClick: () => {
                        filterManager.switchFilter("AdjustmentFilter", { blue: 1.25, brightness: 0.60 })
                    }
                },
            ]
        });
    }
});