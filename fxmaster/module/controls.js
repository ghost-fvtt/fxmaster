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
                    name: "daylight",
                    title: "CONTROLS.Daylight",
                    icon: "fas fa-moon",
                    onClick: () => {
                        filterManager.switchFilter("AdjustmentFilter", 3, { blue: 1.3, brightness: 0.60 }, { blue: 1, brightness: 1 });
                    }
                },
                {
                    name: "underwater",
                    title: "CONTROLS.Underwater",
                    icon: "fas fa-water",
                    onClick: () => {
                        filterManager.switchFilter("DizzyFilter", 0, { enabled: true }, { enabled: false });
                    }
                },
            ]
        });
    }
});