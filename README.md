 [![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
<a href='https://ko-fi.com/H2H21WMKA' target='_blank'><img height='20' style='border:0px;height:20px;' src='https://cdn.ko-fi.com/cdn/kofi2.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

# FX Master

FXMaster is a Foundry VTT module that adds various special effects

- Global effects called weather effects like clouds, fog, but also crows and bats
- Filters including color overlays and underwater
- Clickable special effects, using video effects provided by external sources

This module is made to have an easy configuration.


## Installation Instructions

To install the FXMaster module for Foundry Virtual Tabletop, find FXMaster in the module browser, or paste the following URL into the Install System
dialog on the Setup menu of the application.
https://gitlab.com/mesfoliesludiques/foundryvtt-fxmaster/-/raw/master/module.json
If you wish to manually install the module, you must clone or extract it into the Data/modules/fxmaster folder. You
may do this by cloning the repository.

## Quick tips

FXMaster controls are accessible through the magic wand control on the left of the map.
The Magic hat represents special effects. There are a couple built-ins I borrowed from modules from Jules and Ben's or Jinker. You should install their module to enjoy plenty more. You can add your own as soon as you have a video file. When you add one you should resync the dialog, or close and reopen it.
To cast your Special Effects you can simply click on the canvas. You can orient it if you click, drag your cursor to the direction you want to cast it and drop.

## API for developpers

I added helper functions to add filters and weather effects from other modules

### Filters

```javascript
FXMASTER.filters.switch("myfilterID", "color", { color: "#ff00ff", gamma: 1.0, contrast: 1.0, brightness: 1.0, saturation: 0.2 });
```

#### Available Filter options
- `bloom`
- `color`
- `fog`
- `lightning`
- `oldfilm`
- `predator`
- `underwater`

You can get a complete list by typing `CONFIG.fxmaster.filters` in your web console.

### Weather

- Switching a named weather effect on and off

```javascript
Hooks.call("switchWeather", {
  name: "myweatherID",
  type: "rain",
  options: { density: 100 },
});
```

- Set the active weather effects

```javascript
Hooks.call("updateWeather", [
  { type: "rain", options: {} },
  { type: "bubbles", options: {} },
]);
```

#### Available Weather options:

Weather types:

- rain
- bats
- bubbles
- clouds
- fog
- embers
- crows
- raintop

Options
- speed
- scale
- density
- direction
- tint (must set apply_tint to true)

### Special Effects

Special effects are controls and helpers to play temporary video files over the canvas. They are defined by several parameters

- **file**: the video file path
- **anchor** (x, y): the starting point of the effect. Those are values between 0 and 1.0, and are fractions of the width or height of the video file.
- **position** (x, y): the position at which the anchor of the effect will be placed.
- **angle** (degrees): the initial direction the effect, by default I assume an effect is going from left to right, you would have to set another value if it's not the case.
- **speed**: the speed at which the effect will move toward
- **scale** (x, y): self explanatory
- **animationDelay** (start, end): Delays before or after the effect will move if speed > 0
- **ease**: Easing function used to have a more natural move animation
- **width**: Sets the width of the sprite, can be used to stretch a beam toward a specific target

#### Play a video file on the canvas

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

#### Retrieving effect presets
From module presets
```js
const effectData=CONFIG.fxmaster.specials.fxmaster.effects.find(ef => ef.label === "Blood Splatter");
```
From custom presets
```js
const effectData = CONFIG.fxmaster.specials.custom.effects.find(ef => ef.label === "Energy Circle");
```

#### Play a video file between two tokens

You can use the `canvas.specials.drawSpecialToward` method with an automatic speed to adapt speed so the video ends when the target is reached.

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
    "modules/fxmaster/specials/jinker/dragonBornBlack-CopperAcid30x5Line.webm",
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

#### Animation easing

You can customize the `canvas.specials.drawSpecialToward` to ease the animation toward the target.
Here is an example data, easing options are given in the ease.js file.

```javascript
{
    file: "modules/fxmaster/specials/jinker/dragonBornBlack-CopperAcid30x5Line.webm",
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

## Adding your special effects to FXMaster
Here is a demo module you can use as a template [Specials module Template](https://gitlab.com/mesfoliesludiques/foundryvtt-fxmaster-specials-template).

In a first file, you will configure each one of your special effects
```javascript
export const Effects = {
  label: "MYMODULE",
  effects: [
    {
      label: "Smoke Bomb",
      file: "modules/fxmaster/specials/fxmaster/smokeBomb.webm",
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
Then in a second file you can add the previously created effects by merging them with the CONFIG.fxmaster.specials object as follow.

```javascript
import { Effects } from "./effects.js";

Hooks.once("init", function () {
  // Adding specials
  if (!CONFIG.fxmaster) CONFIG.fxmaster = {};
  foundry.utils.mergeObject(CONFIG.fxmaster, { specials: { MYMODULE: Effects } });
});
```
Effects should now appear in the Specials selection dialog

## Community Contribution

Code and content contributions are accepted. Please feel free to submit issues to the issue tracker or submit merge
requests for code changes. Approval for such requests involves code and (if necessary) design review by U~man. Please
reach out on the Foundry Community Discord with any questions.

## Thanks
Many thanks to:
- `theripper93` for bringing his ideas to handle weather masking elegantly.
- `Wasp` for providing the sequencer module that will inspire future updates.
- `SecretFire` for exchanging ideas, providing help and shaders for filter effects, donate [here](https://ko-fi.com/secretfire).

## Licensing

FXMaster Foundry VTT Module is shared under BSD 3-Clause License .

Jinker's Acid Line and Red Fire Cone video effects are borrowed from [Jinker's Animated Art Foundry VTT Module](https://github.com/jinkergm/JAA), they are shared as free for use.
Jules and Ben's Witch Bolt is borrowed from [JB2A_DnD5E Foundry VTT Module](https://github.com/Jules-Bens-Aa/JB2A_DnD5e), it is shared under [Creative Commons v4](https://creativecommons.org/licenses/by-nc-sa/4.0/)
Seagull sprites used in the Birds weather effect are from [whtdragon](https://forums.rpgmakerweb.com/index.php?threads/whtdragons-animals-and-running-horses-now-with-more-dragons.53552/)
