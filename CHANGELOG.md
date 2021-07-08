# Changelog
All notable changes to this project will be documented in this file.

## [1.2.1] - 2021-07-08
### Changed
- Reworked sliders to be easier to work with
- Fixed spider assets names

## [1.2.0] - 2021-07-03
# Added
- **Breaking:** Reworked weather effects configuration
- Added spider swarm weather effect
- Spanish update
- Inverted weather mask toggle
- set Timeout after stopping effect to force delete if particles are staying too long
- Filters can be applied to a subset of layers
- Added casting modes to Special effects config panel
- Added canvas.fxmaster.playVideo migration warning

## [1.1.4] - 2021-06-23
### Changed
- Hotfix

## [1.1.3] - 2021-06-23
### Changed
- Hotfix

## [1.1.2] - 2021-06-23
- Version update

## [1.1.1] - 2021-06-22
### Added
- Filters configuration panel
- Special effects can be dragged to the macro bar
- Added a drawFacing method
- Special effects can be dropped on the SpecialsLayer to create Tiles
### Changed
- BREAKING MACROS: layers have been split between weather and specials, playVideo method is now integrated in canvas.specials

## [1.1.0] - 2021-06-16
### Added
- Weather masking can be toggled on drawings (see drawing HUD icons)
- Lightning filter
- drawWeather and updateMask Hooks
### Changed
- FXMaster no longer overrides custom layers from other modules

## [1.0.9] - 2021-06-02
### Added
- Custom special effects can be sorted in folders
- Preset special effects can be cloned and overriden for editing
- Special effects are sorted in ascii order in their folder
### Changed
- No longer overrides tokens, background and foreground pixi filters to enhance compatibility
## Removed

## [1.0.8] - 2021-05-30
### Added
- Special effects now have their own permission
### Changed
- FXMasterLayer now extends CanvasLayer (previously PlaceablesLayer), it may correct a few bugs
## Removed

## [1.0.7] - 2021-05-29
### Added
### Changed
- Various fixes for Foundry 0.8.x
## Removed

## [1.0.6] - 2021-05-23
### Added
### Changed
- Fixed Weather UI not updating weather
- PlayVideo and DrawSpecialToward now returns a promise
### Removed

## [1.0.5] - 2021-05-21
### Added
- Donation link
### Changed
- Compatibility with 0.8.4
- Weather effects now end softly on scene update
### Removed

## [1.0.4] - 2021-05-21
### Added
### Changed
- Added legacy link for v0.7.9 compatibility
### Removed

## [1.0.3] - 2021-01-26
### Added
### Changed
- Accepted merge requests for translations
### Removed

## [1.0.2] - 2021-01-08
### Added
- Animation settings in the specials creation dialog
### Changed
- Fixed speed not taken into account without the animationDelay set up
### Removed

## [1.0.1] - 2021-01-06
### Added
- Animation easing
### Changed
- Fixed readme examples
- Show special effects to players
- Special effects can be added with a module
### Removed

## [1.0.0] - 2020-11-29
### Added
- Blood splatter special effect
- Added tooltip on specials labels
- Specials playback rate can be specified in macros only
### Changed
- Specials list is now taken from the CONFIG.fxmaster.specials array so modules can add to it
- Specials now deletes if the video encounters an error
- Fixed socket name for specials
- Specials config dialog is resizable
### Removed

## [0.9.9] - 2020-11-26
### Added
- Added Birds weather effect
- Added speed parameter for moving special effects
### Changed
- Removed a couple of console logs
- Improved the snowstorm effect
### Removed

## [0.9.8] - 2020-11-19
### Added
- Added default values for special effects parameters
### Changed
- Fixed scale not set on special effect edition
### Removed

## [0.9.7] - 2020-11-18
### Added
### Changed
- Fixed weather effect configuration
- Fixed crossOrigin 
### Removed

## [0.9.6] - 2020-11-18
### Added
- Custom special effects can be edited
- Fireball special effect
### Changed
- Fixed weather effects and filter updates 
### Removed