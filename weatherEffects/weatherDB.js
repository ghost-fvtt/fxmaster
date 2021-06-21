import { BubblesWeatherEffect } from "./effects/BubblesWeatherEffect.js";
import { CloudsWeatherEffect } from "./effects/CloudsWeatherEffect.js";
import { EmbersWeatherEffect } from "./effects/EmbersWeatherEffect.js";
import { CrowsWeatherEffect } from "./effects/CrowsWeatherEffect.js";
import { BatsWeatherEffect } from "./effects/BatsWeatherEffect.js";
import { FogWeatherEffect } from "./effects/FogWeatherEffect.js";
import { RaintopWeatherEffect } from "./effects/RaintopWeatherEffect.js";
import { RainSimpleWeatherEffect } from "./effects/RainSimpleWeatherEffect.js";
import { SnowstormWeatherEffect } from "./effects/SnowstormWeatherEffect.js";
import { BirdsWeatherEffect } from "./effects/BirdsWeatherEffect.js";
import { StarsWeatherEffect } from "./effects/StarsWeatherEffect.js";

export const weatherDB = {
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
    birds: BirdsWeatherEffect,
};