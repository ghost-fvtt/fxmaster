import { BubblesWeatherEffect } from "../effects/BubblesWeatherEffect.js";
import { CloudsWeatherEffect } from "../effects/CloudsWeatherEffect.js";
import { EmbersWeatherEffect } from "../effects/EmbersWeatherEffect.js";
import { CrowsWeatherEffect } from "../effects/CrowsWeatherEffect.js";
import { BatsWeatherEffect } from "../effects/BatsWeatherEffect.js";
import { FogWeatherEffect } from "../effects/FogWeatherEffect.js";
import { RaintopWeatherEffect } from "../effects/RaintopWeatherEffect.js";
import { RainSimpleWeatherEffect } from "../effects/RainSimpleWeatherEffect.js";
import { SnowstormWeatherEffect } from "../effects/SnowstormWeatherEffect.js";
import { StarsWeatherEffect } from "../effects/StarsWeatherEffect.js";

import { FXColorFilter } from "../filters/FXColorFilter.js";
import { FXUnderwaterFilter } from "../filters/FXUnderwaterFilter.js";
import { FXPredatorFilter } from "../filters/FXPredatorFilter.js";
import { FXOldFilmFilter } from "../filters/FXOldFilmFilter.js";
import { FXBloomFilter } from "../filters/FXBloomFilter.js";

export const FXMASTER = {
    weatherEffects: {
        snowstorm: SnowstormWeatherEffect,
        bubbles: BubblesWeatherEffect,
        clouds: CloudsWeatherEffect,
        embers: EmbersWeatherEffect,
        rainsimple: RainSimpleWeatherEffect,
        stars: StarsWeatherEffect,
        crows: CrowsWeatherEffect,
        bats: BatsWeatherEffect,
        fog: FogWeatherEffect,
        raintop: RaintopWeatherEffect,
    },
    filters: {
        underwater: FXUnderwaterFilter,
        predator: FXPredatorFilter,
        color: FXColorFilter,
        bloom: FXBloomFilter,
        oldfilm: FXOldFilmFilter
    },
    specials: {
        fxmaster: {
            label: "FXMaster",
            effects: [{
                label: "Smoke Bomb",
                file: "modules/fxmaster/specials/fxmaster/smokeBomb.webm",
                scale: 1,
                angle: 0,
                anchor: {
                    x: 0.5,
                    y: 0.5
                },
                author: ""
            },{
                label: "Red Fire Cone",
                file: "modules/fxmaster/specials/jinker/dragonBornGold-RedFire15Cone.webm",
                scale: 1,
                angle: 0,
                anchor: {
                    x: 0,
                    y: 0.5
                },
                author: "from Jinker"
            }, {
                label: "Acid Line",
                file: "modules/fxmaster/specials/jinker/dragonBornBlack-CopperAcid30x5Line.webm",
                scale: 1,
                angle: 0,
                anchor: {
                    x: 0,
                    y: 0.5
                },
                author: "from Jinker"
            }, {
                label: "Witch Bolt",
                file: "modules/fxmaster/specials/jb2a/Witch_Bolt_Blue_600x200.webm",
                scale: 1,
                angle: 0,
                anchor: {
                    x: 0,
                    y: 0.5
                },
                author: "from JB2A"
            },
        ]
        }
    }
}