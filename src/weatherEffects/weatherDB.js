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
import { RainWeatherEffect } from "./effects/RainWeatherEffect.js";
import { SnowWeatherEffect } from "./effects/SnowWeatherEffect.js";
import { AutumnLeavesWeatherEffect } from "./effects/AutumnLeavesWeatherEffect.js";
import { SpiderWeatherEffect } from "./effects/SpiderWeatherEffect.js";
import { EaglesWeatherEffect } from "./effects/EaglesWeatherEffect.js";
import { RatsWeatherEffect } from "./effects/RatsWeatherEffect.js";

/** @typedef {Record<string, typeof import("./effects/AbstractWeatherEffect.js").AbstractWeatherEffect>} WeatherDB */

export const weatherDB = {
  bats: BatsWeatherEffect,
  birds: BirdsWeatherEffect,
  crows: CrowsWeatherEffect,
  eagles: EaglesWeatherEffect,
  rats: RatsWeatherEffect,
  spiders: SpiderWeatherEffect,

  bubbles: BubblesWeatherEffect,
  embers: EmbersWeatherEffect,
  stars: StarsWeatherEffect,

  leaves: AutumnLeavesWeatherEffect,
  clouds: CloudsWeatherEffect,
  fog: FogWeatherEffect,
  rain: RainWeatherEffect,
  raintop: RaintopWeatherEffect,
  rainsimple: RainSimpleWeatherEffect,
  snow: SnowWeatherEffect,
  snowstorm: SnowstormWeatherEffect,
};
