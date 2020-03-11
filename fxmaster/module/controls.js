import { filterManager } from "../filters/FilterManager.js";
import { EffectsConfig } from "./config.js";
import { ColorizeConfig } from "./config.js";

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
                    },
                    button: true
                },
                {
                    name: "colorize",
                    title: "CONTROLS.Colorize",
                    icon: "fas fa-palette",
                    onClick: () => {
                        new ColorizeConfig().render(true);
                    },
                    button: true
                },
                {
                    name: "underwater",
                    title: "CONTROLS.Underwater",
                    icon: "fas fa-water",
                    onClick: () => {
                        filterManager.switch("dizzy", null, {});
                    },
                    button: true
                },
                // {
                //     name: "specialfx",
                //     title: "CONTROLS.SpecialFX",
                //     icon: "fas fa-fire",
                // onClick: () => {
                // effects = {};
                // effects[randomID()] = {
                //     type: 'bubbles',
                //     config: {
                //         density: 50,
                //         speed: 50,
                //         scale: 50,
                //         tint: "#000000",
                //         direction: 50,
                //         apply_tint: false
                //     }
                // };
                // let bubbles = new BubblesWeatherEffect(canvas.fxmaster.weather);
                // console.log(bubbles.emitters);
                // bubbles.emitters[0].emitterLifetime = 1;
                // bubbles.emitters[0].spawnType  = 'point';
                // bubbles.emitters[0].pos = {x: 100, y: 100};
                // bubbles.play();
                // }
                // },
            ]
        });
    }
});
