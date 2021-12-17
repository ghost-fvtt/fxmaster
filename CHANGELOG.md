# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-rc1](https://github.com/ghost-fvtt/fxmaster/compare/v1.2.1...v2.0.0-rc1) (2021-12-17)


### ⚠ BREAKING CHANGES

* remove `canvas.fxmaster.playVideo`, use
`canvas.specials.playVideo` instead.
* In foundry V9, it's not possible anymore to manipulate
the permissions in `CONST`. For that reason, it was necessary to switch
to using a setting instead. Unfortunately, it is not easily possible to
to migrate from the old way to the new way, so users will have to adapt
their settings to match what they had configured previously.
* A lot of things have been moved around. In particular, the es modules
  * module/controls.js
  * filterEffects/FilterManager.js
  * filterEffects/filtersDB.js
  * specialEffects/specialsDB.js
  * specialEffects/SpecialsLayer.js
  * weatherEffects/weatherDB.js
  * weatherEffects/WeatherLayer.js

  do not exist anymore. Asset files also have been moved.

### Features

* **i18n:** update pt-BR localization ([#106](https://github.com/ghost-fvtt/fxmaster/issues/106)) ([2555f84](https://github.com/ghost-fvtt/fxmaster/commit/2555f84eda0fef114951d8573f0bbaacad9d6835))
* localize titles for layer toggle checkboxes in the filter config ([8873f0e](https://github.com/ghost-fvtt/fxmaster/commit/8873f0e514b09d400e56efc6c9ec4a2f792963ff)), closes [#112](https://github.com/ghost-fvtt/fxmaster/issues/112)
* make all weather effects available in the scene config ([6b1aa56](https://github.com/ghost-fvtt/fxmaster/commit/6b1aa56c839720cf74933284e3b65e45ba78c0ec))
* make compatible with foundry V9 ([e2320a5](https://github.com/ghost-fvtt/fxmaster/commit/e2320a5f17752060500d765d0cd2c3b65ea71b61))
* remove the donation button from the settings ([6298330](https://github.com/ghost-fvtt/fxmaster/commit/6298330ebdefe589f7db280e79816f5a0b884a4c))
* remove WeatherLayer#playVideo ([399b4dd](https://github.com/ghost-fvtt/fxmaster/commit/399b4dd4bdcdc9867977ce7191d174956d437c55))
* rework weather options ([#110](https://github.com/ghost-fvtt/fxmaster/issues/110)) ([5eb0d07](https://github.com/ghost-fvtt/fxmaster/commit/5eb0d07975fce14a60514ec27a0247c05f04da95))
* switch to common package layout ([3f99379](https://github.com/ghost-fvtt/fxmaster/commit/3f993799ca6cb784843ff18ffc21c9aed74767a7))


### Bug Fixes

* fix a bug where weather effects were not removed correctly ([079a610](https://github.com/ghost-fvtt/fxmaster/commit/079a61001c9089ec8d624c1972f0f2f8e6aa30ca))
* fix broken filter macro in compendium ([096c0a5](https://github.com/ghost-fvtt/fxmaster/commit/096c0a55ca366ceac4f8cbcb84ccf8d576ad4571))
* fix problem with filters not being displayed if the filteredLayers have not been set yet ([983d9d8](https://github.com/ghost-fvtt/fxmaster/commit/983d9d820e38f9d6dc1021b077fa87a0b7f79624)), closes [#97](https://github.com/ghost-fvtt/fxmaster/issues/97)
* make non inverted masks work in V9 ([8b251ce](https://github.com/ghost-fvtt/fxmaster/commit/8b251ce00a5708cca6145737c112fbc46816803d))

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