import { weatherDB } from "../weatherEffects/weatherDB.js"
import { filtersDB } from "../filterEffects/filtersDB.js"
import { specialsDB } from "../specialEffects/SpecialsDB.js"

export const FXMASTER = {
    weatherEffects: weatherDB,
    filters: filtersDB,
    specials: specialsDB
}