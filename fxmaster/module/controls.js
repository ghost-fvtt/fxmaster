// let lighton = true;

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
                // {
                //     name: "filters",
                //     title: "CONTROLS.Filters",
                //     icon: "fas fa-moon",
                //     onClick: () => {
                //         // Add filter
                //         if (lighton) {
                //             let filt = new PIXI.filters.AdjustmentFilter({blue: 1.5, brightness: 0.65});
                //             canvas.stage.filters = [filt];
                //             lighton = false;
                //         } else {
                //             canvas.stage.filters = [];
                //             lighton = true;
                //         }
                //     }
                // },
            ]
        });
    }
});