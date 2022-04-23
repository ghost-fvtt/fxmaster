# FXMaster

[![Checks](https://github.com/ghost-fvtt/fxmaster/workflows/Checks/badge.svg)](https://github.com/ghost-fvtt/fxmaster/actions)
![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/ghost-fvtt/fxmaster/releases/latest/download/module.json)
![Latest Release Download Count](https://img.shields.io/github/downloads/ghost-fvtt/fxmaster/latest/module.zip)
[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffxmaster&colorB=4aa94a)](https://forge-vtt.com/bazaar#fxmaster)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ffxmaster%2Fshield%2Fendorsements)](https://www.foundryvtt-hub.com/package/fxmaster/)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-ghostfvtt-00B9FE?logo=kofi)](https://ko-fi.com/ghostfvtt)

FXMaster is a module for [Foundry Virtual Tabletop] that provides various types of effects:

* Global effects, called _Weather Effects_, like rain, clouds, fog, and, snow, but also other particle effects such as
  crows or bats.
* _Filter Effects_, including color overlays, underwater, and lightning.
* Clickable _Special Effects_, using video files provided by external sources.

This module also provides ways to easily configure these effects.

## Table of Contents

- [FXMaster](#fxmaster)
  - [Table of Contents](#table-of-contents)
  - [Installation Instructions](#installation-instructions)
  - [Usage](#usage)
    - [Special Effects <img src="./media/font-awesome/hat-wizard.svg" alt="Special Effects Icon" height="20" />](#special-effects-)
      - [Playing Special Effects](#playing-special-effects)
      - [Cast Modes](#cast-modes)
      - [Managing Custom Special Effects](#managing-custom-special-effects)
    - [Weather Effects <img src="./media/font-awesome/cloud-rain.svg" alt="Weather Effects Icon" height="20" />](#weather-effects-)
      - [Masking Weather Effects](#masking-weather-effects)
      - [⚠ Warning Regarding Large Scenes](#-warning-regarding-large-scenes)
    - [Invert Weather Mask <img src="./media/font-awesome/mask.svg" alt="Invert Weather Mask Icon" height="20" />](#invert-weather-mask-)
    - [Filter Effects <img src="./media/font-awesome/filter.svg" alt="Filter Effects Icon" height="20" />](#filter-effects-)
      - [Limiting Filter Effects to Certain Layers](#limiting-filter-effects-to-certain-layers)
    - [Save Weather and Filters as Macro <img src="./media/font-awesome/save.svg" alt="Save Weathe and Filters as Macro Icon" height="20" />](#save-weather-and-filters-as-macro-)
    - [Clear Weather and Filters <img src="./media/font-awesome/trash.svg" alt="Clear Weather and Filters Icon" height="20" />](#clear-weather-and-filters-)
  - [Developer API](#developer-api)
    - [Filters Effects](#filters-effects)
      - [Available Filter Effects With Supported Options](#available-filter-effects-with-supported-options)
    - [Weather Effects](#weather-effects)
      - [Available Weather Effects With Supported Options](#available-weather-effects-with-supported-options)
      - [Weather Effect Options](#weather-effect-options)
    - [Special Effects](#special-effects)
      - [Playing a Video File on the Canvas](#playing-a-video-file-on-the-canvas)
      - [Retrieving Effect Presets](#retrieving-effect-presets)
      - [Playing a Video File Between Two Tokens](#playing-a-video-file-between-two-tokens)
      - [Animation Easing](#animation-easing)
    - [Adding Your Own Special Effects to FXMaster](#adding-your-own-special-effects-to-fxmaster)
  - [Contributing](#contributing)
  - [Acknowledgement](#acknowledgement)
  - [Licensing](#licensing)

## Installation Instructions

To install FXMaster, find FXMaster in the module browser, or paste the following URL into the Install Module dialog in
the Setup menu of Foundry Virtual Tabletop:

```
https://github.com/ghost-fvtt/fxmaster/releases/latest/download/module.json
```

## Usage

The functionality of FXMaster can be accessed via the _Effect Controls_
(<img src="./media/font-awesome/magic.svg" alt="Effect Controls Incon" height="20" />) in the scene controls. Each
individual functionality of FXMaster has its own tool inside this scene control.

### Special Effects <img src="./media/font-awesome/hat-wizard.svg" alt="Special Effects Icon" height="20" />

_Special Effects_ are essentially video files that can be played on the canvas via clicking or dragging. FXMaster
includes only a couple of example effects. If you want more, you will need to install a module providing animation files
like [JB2A], [Jinker's Animated Art], or [Jack Kerouac's Animated Spell Effects]. All of them integrate with FXMaster.
Alternatively, you can also [add your own _Special Effects_](#managing-custom-special-effects).

Clicking on this tool opens the _Special Effects Management_ dialog:

![Special Effects Management](./media/screenshots/special-effects-management.png)

In this dialog, you can see folders containing different sets of _Special Effects_. By clicking on a folder, you expand
it:

![Special Effects Management Folders Expanded](./media/screenshots/special-effects-management-folders-expanded.png)

You can preview the effects by hovering over the black box with your mouse.

Predefined _Special Effects_ have a clone icon
(<img src="./media/font-awesome/clone.svg" alt="Clone Special Effect Icon" height="20" />) on the right. By clicking it,
you open a dialog to create a custom _Special Effect_, prefilled with the data from this _Special Effect_. For more
information on creating custom _Special Effects_, see
[Managing Custom Special Effects](#managing-custom-special-effects).

#### Playing Special Effects

In order to play a special effect, simply select it from the list and click on the canvas while having the _Effects
Controls_ active (it doesn't work if you have any other control such as the Token Controls active). Alternatively, you
can drag on the canvas, which shows a red line from the start point to your mouse pointer. Releasing the mouse button
then results in the effect being played, facing the direction you dragged towards. Depending on the selected
[_Cast Mode_](#cast-modes), the _Special Effect_ might also move or scale towards that direction.

You can also create permanently playing variants of _Special Effects_. In order to do so, simply drag the
_Special Effect_ from the _Special Effects Management_ onto the scene. This creates a tile with the video of the
_Special Effect_. In particular, that means in order to remove it again, you need to go to the Tile Controls and delete
it there.

#### Cast Modes

The first five icons in the top row of the _Special Effects Management_ provide a way to switch between the different
_Cast Modes_ for _Special Effects_, simply by clicking on them. Here is an overview of the available modes:

| _Cast Mode_      |                                               Icon                                                | Description                                                                                                             |
| ---------------- | :-----------------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------- |
| Face Target      |        <img src="./media/font-awesome/compress.svg" alt="Face Target Icon" height="20" />         | _Special Effects_ face towards the target.                                                                              |
| Move to Target   |        <img src="./media/font-awesome/rocket.svg" alt="Move to Target Icon" height="20" />        | _Special Effects_ face and move towards the target.                                                                     |
| Extend to Target | <img src="./media/font-awesome/angle-double-right.svg" alt="Extend to Target Icon" height="20" /> | _Special Effects_ face towards the target and extend to it.                                                             |
| Expand to Target | <img src="./media/font-awesome/expand-arrows-alt.svg" alt="Expand to Target Icon" height="20" />  | _Special Effects_ face towards the target and expand to it, scaling the whole effect up while keeping the aspect ratio. |
| Rotate           |             <img src="./media/font-awesome/undo.svg" alt="Rotate Icon" height="20" />             | _Special Effects_ rotate clockwise. The dragged distance specifies the rotation speed.                                  |

#### Managing Custom Special Effects

Custom _Special Effects_ can be added in two ways: By cloning a predefined one as explained above, or by clicking the
plus icon (<img src="./media/font-awesome/plus.svg" alt="Rotate Icon" height="20" />) in the top row of the
_Special Effects Management_. In both cases, a dialog to create a new custom _Special Effect_ is opened:

![Special Effect Creation](./media/screenshots/special-effect-creation.png)

In this dialog, you can choose the name of the _Special Effect_, specify the folder it should be created in (you can
also specify a new folder name), select the video file to use, and configure the various options. Once you are done, hit
the “Save Changes” button to save the _Special Effect_ and close the dialog.

![Custom Special Effects](media/screenshots/custom-special-effects.png)

Instead of the clone icon that predefined _Special Effects_ have, custom ones have edit
(<img src="./media/font-awesome/edit.svg" alt="Edit Special Effect Icon" height="20" />) and delete
(<img src="./media/font-awesome/trash.svg" alt="Delete Special Effect Icon" height="20" />) icons. Clicking the edit
icon opens the dialog to create a custom _Special Effect_, prefilled with the data from this one. You can overwrite the
existing one by keeping the name and folder the same. Clicking the delete icon simply deletes the _Special Effect_.

### Weather Effects <img src="./media/font-awesome/cloud-rain.svg" alt="Weather Effects Icon" height="20" />

_Weather Effects_ are global effects that are displayed all across the scene. They include regular weather effects like
rain, fog, clouds, and snow, but also other global particle effects such as birds flying across the scene or spiders
crawling around.

Clicking on this tool opens the _Weather Effects Management_ dialog:

![Weather Effects Management](./media/screenshots/weather-effects-management.png)

In this dialog, you can configure individual weather effects. They are sorted into different groups (“Animals”, “Other”,
and “Weather”). By clicking on a group, you expand it, showing all effects in that group:

![Weather Effects Management With Group Expanded](./media/screenshots/weather-effects-management-group-expanded.png)

You can activate individual weather effects by checking the corresponding checkbox and then clicking
on “Save Changes”.

By clicking on the name of a _Weather Effect_, you expand it, showing the options for that effect:

![Weather Effect Options](./media/screenshots/weather-effect-options.png)

The available options differ slightly between _Weather Effects_ because not all options make sense for all of them. The
options are:
| Option     | Description                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| Scale      | A factor that scales the effect relative to its base size.                                                                  |
| Direction  | The direction of the effect in degrees.                                                                                     |
| Speed      | A factor that adjusts the speed of the effect relative to its base speed.                                                   |
| Lifetime   | A factor that adjusts the lifetime of the individual particles.                                                             |
| Density    | The density of the effect. For most effects, it represents the number of particles per grid unit.                           |
| Tint       | Tint the effect with this color.                                                                                            |
| Animations | A selection of animations from the list of animations for the effect to use. If it is empty, the default animation is used. |

Once you are finished with adjusting the options, you can apply them by clicking the “Save Changes” button.

#### Masking Weather Effects

By default, _Weather Effects_ are displayed all across the entire scene. However, it is possible to constrain them to
specific areas. This can be achieved by creating drawings and then marking them as _Weather Mask_. To do that, open the
HUD for the drawing (by right-clicking the drawing) and then click on the “Mask FXMaster Weather” control icon
(<img src="./media/font-awesome/cloud.svg" alt="Mask FXMaster Weather Control Icon" height="20" />) on the left of the
drawing HUD:

![Drawing HUD with Weather Mask](./media/screenshots/drawing-hud-weather-mask.png)

You can mark as many drawings as mask as you want.

By default, the _Weather Effects_ are only displayed outside the marked areas. This can be inverted via the
[_Invert Weather Mask_](#invert-weather-mask-) tool.

#### ⚠ Warning Regarding Large Scenes

Similar to the foundry core weather effects, the _Weather Effects_ provided by FXMaster can have a pretty significant
impact on performance in large scenes (around 10,000 px × 10,000 px and larger). Be careful when enabling
_Weather Effects_ in such scenes as it might make them crash. If that happens, launch the world in safe configuration
and delete the configured _Weather Effects_ for the scene by running the following as a script macro or in the developer
console (F12):

```js
canvas.scene.unsetFlag("fxmaster", "effects");
```

You can then safely reactivate your modules.

### Invert Weather Mask <img src="./media/font-awesome/mask.svg" alt="Invert Weather Mask Icon" height="20" />

Clicking on this tool inverts the _Weather Mask_ for the current scene. This tool acts as a toggle and the color
indicates whether it is currently active or not.

Inverting the _Weather Mask_ can be very useful when the goal is to display _Weather Effects_ only in specific smaller
areas, instead of specifying the areas in which they should not be displayed, which is the default.

### Filter Effects <img src="./media/font-awesome/filter.svg" alt="Filter Effects Icon" height="20" />

_Filter Effects_ work similarly to _Weather Effects_. They are also displayed all across the entire scene but unlike
_Weather Effects_ it's _not_ possible to confine them to certain areas with a mask.

Clicking on this tool open the _Filter Effects Management_ dialog:

![Filter Effects Management](./media/screenshots/filter-effects-management.png)

You can activate individual _Filter Effects_ by checking the corresponding checkbox and then clicking on “Save Changes”.

By clicking on the name of a _Filter Effect_, you expand it, showing the options for that effect:

![Filter Effect Options](./media/screenshots/filter-effect-options.png)

The available options differ heavily between individual _Filter Effects_, so it doesn't make much sense to list them
here.

Once you are finished with adjusting the options, you can apply them by clicking the “Save Changes” button.


#### Limiting Filter Effects to Certain Layers

With the four checkboxes at the top of the _Filter Effects Management_ dialog, you can specify which layers the
_Filter Effects_ are applied to. The selectable layers are:
* “Background” (<img src="./media/font-awesome/road.svg" alt="Background Layer Icon" height="20" />)
* “Foreground” (<img src="./media/font-awesome/home.svg" alt="Foreground Layer Icon" height="20" />)
* “Drawings” (<img src="./media/font-awesome/pencil-alt.svg" alt="Drawings Layer Icon" height="20" />)
* “Tokens” (<img src="./media/font-awesome/user-alt.svg" alt="Token Layer Icon" height="20" />)

Changes to these checkboxes can also be applied by clicking the “Save Changes” button.

**⚠ Warning:** This functionality is experimental and might be removed in the future. It also has some weird effects on
some _Filter Effects_. So please use it at your own risk and don't rely on the functionality too much.

### Save Weather and Filters as Macro <img src="./media/font-awesome/save.svg" alt="Save Weathe and Filters as Macro Icon" height="20" />

This tool allows you to create a macro from the currently active _Weather Effects_ and _Filter Effects_. When clicking
this tool, a macro is created in the macro directory. It's not put into the hotbar, so you need to drag it there
yourself if you want to.

When executed, the macro sets the _Weather Effects_ and _Filter Effects_ of the current scene to the state from when the
macro was created.

### Clear Weather and Filters <img src="./media/font-awesome/trash.svg" alt="Clear Weather and Filters Icon" height="20" />

When clicked, this tool shows a confirmation dialog to delete all _Weather Effects_ and _Filter Effects_ from the
current scene.

## Developer API

FXMaster provides functionality to interact with _Filter Effects_, _Weather Effects_, and _Special Effects_ from other
packages and macros.

### Filters Effects

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

#### Available Filter Effects With Supported Options

| Type         | Options                                                  |
| ------------ | -------------------------------------------------------- |
| `lightning`  | `frequency`, `spark_duration`, `brightness`              |
| `underwater` | `speed`, `scale`                                         |
| `predator`   | `noise`, `period`, `lineWidth`                            |
| `color`      | `color`, `saturation`, `contrast`, `brightness`, `gamma` |
| `bloom`      | `blur`, `bloomScale`, `threshold`                        |
| `oldfilm`    | `sepia`, `noise`                                         |

You can get a complete list by typing `CONFIG.fxmaster.filters` in your web console.

### Weather Effects

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

You can use the `canvas.specials.drawSpecialToward` method with the speed set to `"auto"` to adapt the speed so that the
video ends when the target is reached.

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

### Adding Your Own Special Effects to FXMaster

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
* The control and tool icons are from [Font Awesome], licensed under the [CC BY-4.0].
* The rats icon is a derivative work of “Rat” by DataBase Center for Life Science (DBCLS)
  (https://togotv.dbcls.jp/en/togopic.2021.006.html), used under [CC BY-4.0], and licensed under [CC BY-4.0].
* The rat sprites used in the Rats weather effects by crymoonster are licensed under [CC BY-4.0].

[Foundry Virtual Tabletop]: https://foundryvtt.com/
[JB2A]: https://github.com/Jules-Bens-Aa/JB2A_DnD5e
[Jinker's Animated Art]: https://github.com/jinkergm/JAA
[Jack Kerouac's Animated Spell Effects]: https://github.com/jackkerouac/animated-spell-effects
[FoundryVTT FXMaster Specials Demo Template]: https://gitlab.com/mesfoliesludiques/foundryvtt-fxmaster-specials-template
[U~man]: https://github.com/mesfoliesludiques
[theripper93]: https://github.com/theripper93
[Wasp]: https://github.com/fantasycalendar
[SecretFire]: https://github.com/Feu-Secret
[Sequencer]: https://github.com/fantasycalendar/FoundryVTT-Sequencer
[CC BY-NC-SA-4.0]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[whtdragon]: https://forums.rpgmakerweb.com/index.php?threads/whtdragons-animals-and-running-horses-now-with-more-dragons.53552/
[Font Awesome]: https://fontawesome.com/
[CC BY-4.0]: https://creativecommons.org/licenses/by/4.0/
