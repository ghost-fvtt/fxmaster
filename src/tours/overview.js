import { FXMasterBaseTour } from "./base.js";
import { CanvasLayerMixin } from "./mixins/canvas-layer.js";
import { WaitForSelectorMixin } from "./mixins/wait-for-selector.js";

export class OverviewTour extends WaitForSelectorMixin(CanvasLayerMixin(FXMasterBaseTour)) {
  constructor() {
    super({
      id: "overview",
      title: "FXMASTER.TourOverviewTitle",
      description: "FXMASTER.TourOverviewDescription",
      canBeResumed: true,
      display: true,
      steps: [
        {
          id: "welcome",
          title: "FXMASTER.TourOverviewWelcomeTitle",
          content: "FXMASTER.TourOverviewWelcomeContent",
        },
        {
          id: "effect-controls",
          selector: '.scene-control.active[data-control="effects"]',
          title: "FXMASTER.TourOverviewEffectControlsTitle",
          content: "FXMASTER.TourOverviewEffectControlsContent",
          layer: "specials",
        },
        {
          id: "special-effects",
          selector: '.sub-controls.active .control-tool[data-tool="special-effects"]',
          title: "FXMASTER.TourOverviewSpecialEffectsTitle",
          content: "FXMASTER.TourOverviewSpecialEffectsContent",
          layer: "specials",
        },
        {
          id: "particle-effects",
          selector: '.sub-controls.active .control-tool[data-tool="particle-effects"]',
          title: "FXMASTER.TourOverviewParticleEffectsTitle",
          content: "FXMASTER.TourOverviewParticleEffectsContent",
          layer: "specials",
        },
        {
          id: "invert-mask",
          selector: '.sub-controls.active .control-tool[data-tool="invert-mask"]',
          title: "FXMASTER.TourOverviewInvertMaskTitle",
          content: "FXMASTER.TourOverviewInvertMaskContent",
          layer: "specials",
        },
        {
          id: "filter-effects",
          selector: '.sub-controls.active .control-tool[data-tool="filter-effects"]',
          title: "FXMASTER.TourOverviewFilterEffectsTitle",
          content: "FXMASTER.TourOverviewFilterEffectsContent",
          layer: "specials",
        },
        {
          id: "save",
          selector: '.sub-controls.active .control-tool[data-tool="save"]',
          title: "FXMASTER.TourOverviewSaveTitle",
          content: "FXMASTER.TourOverviewSaveContent",
          layer: "specials",
        },
        {
          id: "clearfx",
          selector: '.sub-controls.active .control-tool[data-tool="clearfx"]',
          title: "FXMASTER.TourOverviewClearTitle",
          content: "FXMASTER.TourOverviewClearContent",
          layer: "specials",
        },
        {
          id: "help",
          title: "FXMASTER.TourOverviewHelpTitle",
          content: "FXMASTER.TourOverviewHelpContent",
        },
      ],
      suggestedNextTours: ["fxmaster.specialEffects"],
    });
  }
}
