# FX Master
FXMaster is a Foundry VTT module that adds various special effects
 - Global effects called weather effects like clouds, fog, but also crows and bats
 - Filters including color overlays and underwater

This module is made to have an easy configuration.

## Installation Instructions
To install the FXMaster module for Foundry Virtual Tabletop, simply paste the following URL into the Install System
dialog on the Setup menu of the application.
https://gitlab.com/mesfoliesludiques/foundryvtt-fxmaster/-/raw/master/fxmaster/module.json
If you wish to manually install the module, you must clone or extract it into the Data/modules/fxmaster folder. You
may do this by cloning the repository.

## API for developpers
I added Hooks to add filters and weather effects from other modules

### Filters
```javascript
Hooks.call('switchFilter', {name:'myfilterID', type: 'color', options: {red: 0, green: 1.5, blue: 1.5}});
```
#### Available Filter options:
Filter types:
- color
- underwater

Options for color:
- red
- green
- blue

### Weather
```javascript
Hooks.call('switchWeather', {name:'myweatherID', type: 'rain', {density: 100}});
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

Options are numbers between 0 and 100, 50 being the default value. It's a bit abstract I know, it may change later.
Options
- speed
- scale
- density
- direction
- tint (must set apply_tint to true)


## Community Contribution
Code and content contributions are accepted. Please feel free to submit issues to the issue tracker or submit merge
requests for code changes. Approval for such requests involves code and (if necessary) design review by U~man. Please
reach out on the Foundry Community Discord with any questions.