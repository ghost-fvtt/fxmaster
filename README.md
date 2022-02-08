# FXMaster

[![Checks](https://github.com/ghost-fvtt/fxmaster/workflows/Checks/badge.svg)](https://github.com/ghost-fvtt/fxmaster/actions)
![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/ghost-fvtt/fxmaster/releases/latest/download/module.json)
![Latest Release Download Count](https://img.shields.io/github/downloads/ghost-fvtt/fxmaster/latest/module.zip)
[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffxmaster&colorB=4aa94a)](https://forge-vtt.com/bazaar#fxmaster)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ffxmaster%2Fshield%2Fendorsements)](https://www.foundryvtt-hub.com/package/fxmaster/)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-ghostfvtt-00B9FE?logo=kofi)](https://ko-fi.com/ghostfvtt)

FXMaster is a module for [Foundry Virtual Tabletop] that adds various special effects:

* Global effects, called weather effects, like clouds, fog, but also crows and bats.
* Filters, including color overlays and underwater.
* Clickable special effects, using video effects provided by external sources.

This module also provides ways to easily configure these effects.

## Installation Instructions

To install FXMaster, find FXMaster in the module browser, or paste the following URL into the Install Module dialog in
the Setup menu of the Foundry Virtual Tabletop:

```
https://github.com/ghost-fvtt/fxmaster/releases/latest/download/module.json
```

## Quick Tips

* The FXMaster controls are accessible through the magic wand control icon.
* The Magic hat represents special effects.
* There are a couple built-ins that are borrowed from modules from Jules and Ben and Jinker. Installing their modules
  will give you access to many more of their brilliant assets.
* You can add your own video files as custom special effects. After adding a custom special effect, you should resync
  the dialog, or close and reopen it.
* Playing the special effects is done by clicking on the canvas. You can orient them by clicking and dragging the cursor
  into the direction you want to the effect to face.
* You can mask your weather effects by creating drawings and then marking them as weather mask (open the HUD of the
  drawing and click on the cloud icon in the top left). The complete mask can be inverted by clicking the mask control
  icon in the FXMaster controls. Masking Filter effects is not supported at this time.


## ⚠ Warning Regarding Large Scenes

Similar to the foundry core weather effects, the weather effects provided by FXMaster can have a pretty negative impact
on performance in very large scenes (think 10000 x 10000 and larger). Be careful when enabling weather effects in such
scenes as it might make them crash. If that happens, launch the world in safe configuration and delete the effects set
for the scene by running the following as a script macro or in the developer console (F12):

```js
canvas.scene.unsetFlag("fxmaster", "effects");
```

You can then safely reactivate your modules.

## Developer API

FXMaster provides functionality to interact with filters and weather effects from other packages and macros.

### Filters

* Adding a named filter
  ```javascript
  FXMASTER.filters.addFilter("myfilterID", "color", {
    color: { value:"#ff00ff", apply: true },
    gamma: 1.0,
    contrast: 1.0,
    brightness: 1.0,
    saturation: 0.2
  });
  ```
* Removing a named filter
  ```javascript
  FXMASTER.filters.removeFilter("myfilterID");
  ```
* Toggling a named filter on and off
  ```javascript
  FXMASTER.filters.switch("myfilterID", "color", {
    color: { value:"#ff00ff", apply: true },
    gamma: 1.0,
    contrast: 1.0,
    brightness: 1.0,
    saturation: 0.2
  });
  ```
* Setting the list of active filters
  ```javascript
    FXMASTER.filters.setFilters([
      { type: "color", options: { /* ... */ } },
      { type: "lightning", options: { /* ... */ } },
    ]);
  ```

#### Available Filters Effects

| Type         | Options                                                  |
| ------------ | -------------------------------------------------------- |
| `lightning`  | `frequency`, `spark_duration`, `brightness`              |
| `underwater` | `speed`, `scale`                                         |
| `predator`   | `noise`, `period`                                        |
| `color`      | `color`, `saturation`, `contrast`, `brightness`, `gamma` |
| `bloom`      | `blur`, `bloomScale`, `threshold`                        |
| `oldfilm`    | `sepia`, `noise`                                         |

You can get a complete list by typing `CONFIG.fxmaster.filters` in your web console.

### Weather

* Switching a named weather effect on and off:
  ```javascript
  Hooks.call("fxmaster.switchWeather", {
    name: "myweatherID",
    type: "rain",
    options: { density: 0.5 },
  });
  ```
* Setting the active weather effects:
  ```javascript
  Hooks.call("fxmaster.updateWeather", [
    { type: "rain", options: { /* ... */ } },
    { type: "bubbles", options: { /* ... */ } },
  ]);
  ```

#### Available Weather Effects With Supported Options

| Type         | `scale` | `direction` | `speed` | `lifetime` | `density` | `tint` |         `animations`         |
| ------------ | :-----: | :---------: | :-----: | :--------: | :-------: | :----: | :--------------------------: |
| `snowstorm`  |    ✓    |      ✓      |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `bubbles`    |    ✓    |             |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `clouds`     |    ✓    |      ✓      |    ✓    |     ✓      |           |   ✓    |                              |
| `embers`     |    ✓    |             |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `rainsimple` |    ✓    |      ✓      |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `stars`      |    ✓    |             |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `crows`      |    ✓    |             |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `bats`       |    ✓    |             |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `spiders`    |    ✓    |             |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `fog`        |    ✓    |             |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `raintop`    |    ✓    |      ✓      |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `birds`      |    ✓    |             |    ✓    |     ✓      |     ✓     |   ✓    | ✓ (`glide`, `flap`, `mixed`) |
| `leaves`     |    ✓    |             |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `rain`       |    ✓    |      ✓      |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `snow`       |    ✓    |      ✓      |    ✓    |     ✓      |     ✓     |   ✓    |                              |
| `eagles`     |    ✓    |             |    ✓    |     ✓      |     ✓     |   ✓    |     ✓ (`glide`, `flap`)      |

#### Weather Effect Options

| Option       | Type                              | Description                                                                                                                         |
| ------------ | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `scale`      | `number`                          | A factor that scales the effect relative to its base size.                                                                          |
| `direction`  | `number`                          | The direction of the effect in degrees.                                                                                             |
| `speed`      | `number`                          | A factor that adjusts the speed of the effect relative to its base speed.                                                           |
| `lieftime`   | `number`                          | A factor that adjusts the lifetime of the individual particles.                                                                     |
| `density`    | `number`                          | The density of the effect. For most effects, it represents the number of particles per grid unit.                                   |
| `tint`       | `{value: string, apply: boolean}` | Tint the effect with this color.                                                                                                    |
| `animations` | `string[]`                        | An array of animations from list of animations for the effect to use. If it is empty or not defined, the default animation is used. |

### Special Effects

Special effects are essentially temporary video files that are being played on the canvas. They are defined by several
parameters:

| Parameter        | Type                           | Description                                                                                                                                                                             |
| ---------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file`           | `string`                       | The video file path.                                                                                                                                                                    |
| `anchor`         | `{x: number, y: number}`       | The starting point of the effect. `x` and `y` are values between `0` and `1.0`, representing fractions of the width and height of the video file.                                       |
| `position`       | `{x: number, y: number}`       | The position at which the anchor of the effect is to be placed.                                                                                                                         |
| `angle`          | `number`                       | The initial direction of the effect in degrees. The default assumption is that the effect direction from left to right. If that's not the case, you need to set this value accordingly. |
| `speed`          | `number \| "auto"`             | The speed at which the effect plays and moves.                                                                                                                                          |
| `scale`          | `{x: number, y: number}`       | The scale of the effect. `x` and `y` are numbers between `0` and `1`, representing by how much the width and height of the effect are scaled.                                           |
| `animationDelay` | `{start: number, end: number}` | Delays before and after the effect plays (if `speed > 0`).                                                                                                                              |
| `ease`           | `string`                       | The easing function to use in order for the movement animation to look more natural. You can find the valid values in `easeFunctions` in [ease.js](./src/ease.js).                      |
| `width`          | `number`                       | Sets the width of the sprite. For example, this can be used to stretch a beam towards a specific target.                                                                                |

#### Playing a Video File on the Canvas

```javascript
const data = {
  file: "myfile.webm",
  position: {
    x: 1200,
    y: 1200,
  },
  anchor: {
    x: 0,
    y: 1,
  },
  angle: 90,
  speed: 0,
  scale: {
    x: 0.7,
    y: 0.7,
  },
};
canvas.specials.playVideo(data);
game.socket.emit("module.fxmaster", data);
```

#### Retrieving Effect Presets

From module presets

```js
const effectData = CONFIG.fxmaster.specials.fxmaster.effects.find(ef => ef.label === "Blood Splatter");
```

From custom presets

```js
const effectData = CONFIG.fxmaster.specials.custom.effects.find(ef => ef.label === "Energy Circle");
```

#### Playing a Video File Between Two Tokens

You can use the `canvas.specials.drawSpecialToward` method with the speed set to `"auto"` to adapt the speed so that the video ends
when the target is reached.

```javascript
function castSpell(effect) {
  const tokens = canvas.tokens.controlled;
  if (tokens.length == 0) {
    ui.notifications.error("Please select a token");
    return;
  }
  game.user.targets.forEach((i, t) => {
    canvas.specials.drawSpecialToward(effect, tokens[0], t);
  });
}

castSpell({
  file:
    "modules/fxmaster/assets/specialEffects/jinker/dragonBornBlack-CopperAcid30x5Line.webm",
  anchor: {
    x: -0.08,
    y: 0.5,
  },
  speed: "auto",
  angle: 0,
  scale: {
    x: 1,
    y: 1,
  },
});
```

#### Animation Easing

You can customize the `canvas.specials.drawSpecialToward` to ease the animation toward the target. Here is some example
data. The easing options are given in the `ease.js` file.

```javascript
{
  file: "modules/fxmaster/assets/specialEffects/jinker/dragonBornBlack-CopperAcid30x5Line.webm",
    anchor: {
      x: -.08,
      y: 0.5
    },
  speed: "auto",
  angle: 0,
  scale: {
    x: 1,
    y: 1
  }
  animationDelay: {
    start: 0.5,
    end: 0.2
  },
  ease: "InCirc"
}
```

## Adding Your Own Special Effects to FXMaster

Here is a demo module you can use as a template: [FoundryVTT FXMaster Specials Demo Template].

In one file, you configure each of your special effects:

```javascript
export const effects = {
  label: "MYMODULE",
  effects: [
    {
      label: "Smoke Bomb",
      file: "modules/fxmaster/assets/specialEffects/fxmaster/smokeBomb.webm",
      scale: {
        x: 1.0,
        y: 1.0,
      },
      angle: 0,
      anchor: {
        x: 0.5,
        y: 0.5,
      },
      speed: 0,
      author: "U~man",
    },
  ],
};
```

Then, in a second file, you add the previously created effects by merging them into the `CONFIG.fxmaster.specials`
object as follows:

```javascript
import { effects } from "./effects.js";

Hooks.once("init", function () {
  // Adding specials
  if (!CONFIG.fxmaster) CONFIG.fxmaster = {};
  foundry.utils.mergeObject(CONFIG.fxmaster, { specials: { MYMODULE: effects } });
});
```

The effects should now appear in the Specials selection dialog.

## Contributing

Code and content contributions are accepted. Please feel free to submit issues to the issue tracker or submit pull
requests for code changes.

## Acknowledgement

Many thanks to:

* [U~man] for the original work on this module. Really, most of this is his work.
* [theripper93] for contributing his ideas regarding handling weather masking elegantly.
* [Wasp] for providing the [Sequencer] module that will inspire future updates.
* [SecretFire] for exchanging ideas, providing help, and shaders for the filter effects. Donate
  [here](https://ko-fi.com/secretfire).

## Licensing

* FXMaster is licensed under the BSD 3-Clause "New" or "Revised" License, a copy of which can be found at
  [LICENSE.md](./LICENSE.md).
* Jinker's Acid Line and Red Fire Cone video effects are borrowed from [Jinker's Animated Art] and are licensed as free
  for use.
* Jules and Ben's Witch Bolt effect is from [JB2A] and is licensed under [CC BY-NC-SA-4.0].
* The Seagull sprites used in the Birds weather effect are from [whtdragon].

[Foundry Virtual Tabletop]: https://foundryvtt.com/
[FoundryVTT FXMaster Specials Demo Template]: https://gitlab.com/mesfoliesludiques/foundryvtt-fxmaster-specials-template
[U~man]: https://github.com/mesfoliesludiques
[theripper93]: https://github.com/theripper93
[Wasp]: https://github.com/fantasycalendar
[SecretFire]: https://github.com/Feu-Secret
[Sequencer]: https://github.com/fantasycalendar/FoundryVTT-Sequencer
[Jinker's Animated Art]: https://github.com/jinkergm/JAA
[JB2A]: https://github.com/Jules-Bens-Aa/JB2A_DnD5e
[CC BY-NC-SA-4.0]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[whtdragon]: https://forums.rpgmakerweb.com/index.php?threads/whtdragons-animals-and-running-horses-now-with-more-dragons.53552/
