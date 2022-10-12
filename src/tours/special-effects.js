import { packageId } from "../constants.js";
import { SpecialEffectsManagement } from "../special-effects/applications/special-effects-management.js";
import { waitForElement } from "../utils.js";
import { CloseAppsMixin } from "./mixins/close-apps.js";
import { WaitForSelectorMixin } from "./mixins/wait-for-selector.js";
import { CanvasLayerMixin } from "./mixins/canvas-layer.js";
import { FXMasterBaseTour } from "./base.js";

export class SpecialEffectsTour extends WaitForSelectorMixin(CloseAppsMixin(CanvasLayerMixin(FXMasterBaseTour))) {
  constructor() {
    super({
      id: "specialEffects",
      title: "FXMASTER.TourSpecialEffectsTitle",
      description: "FXMASTER.TourSpecialEffectsDescription",
      canBeResumed: true,
      display: true,
      steps: [
        {
          id: "introduction",
          title: "FXMASTER.TourSpecialEffectsIntroductionTitle",
          content: "FXMASTER.TourSpecialEffectsIntroductionContent",
          closeApps: true,
        },
        {
          id: "tool",
          selector: '.sub-controls.active .control-tool[data-tool="special-effects"]',
          title: "FXMASTER.TourSpecialEffectsToolTitle",
          content: "FXMASTER.TourSpecialEffectsToolContent",
          layer: "specials",
          closeApps: true,
        },
        {
          id: "list",
          selector: "#specials-config .directory-list",
          title: "FXMASTER.TourSpecialEffectsListTitle",
          content: "FXMASTER.TourSpecialEffectsListContent",
          layer: "specials",
          tooltipDirection: "LEFT",
          _preStep: async () => {
            await this.#renderApp();
          },
        },
        {
          id: "selected",
          selector: '[data-folder-id="fxmaster"] [data-effect-id="0"]',
          title: "FXMASTER.TourSpecialEffectsSelectedTitle",
          content: "FXMASTER.TourSpecialEffectsSelectedContent",
          layer: "specials",
          tooltipDirection: "LEFT",
          _preStep: async () => {
            await this.#renderAppIfNeeded();
            await this.#selectFirstEffect();
          },
          _postStep: async () => {
            if (this._nextStepIndex === this.stepIndex + 1) {
              const effectPreview = await waitForElement(
                '[data-folder-id="fxmaster"] [data-effect-id="0"] .preview video',
              );
              const endedPromise = new Promise((resolve) => {
                function onEnded(event) {
                  resolve(event);
                  effectPreview.removeEventListener("ended", onEnded);
                }
                effectPreview.addEventListener("ended", onEnded);
              });
              effectPreview.dispatchEvent(new UIEvent("mouseover"));
              await endedPromise;
            }
          },
        },
        {
          id: "playing",
          title: "FXMASTER.TourSpecialEffectsPlayingTitle",
          content: "FXMASTER.TourSpecialEffectsPlayingContent",
          layer: "specials",
          _preStep: async () => {
            await this.#renderAppIfNeeded();
            await this.#selectFirstEffect();
          },
          _postStep: async () => {
            if (this._nextStepIndex === this.stepIndex + 1) {
              await game.canvas.recenter();
              const data = {
                ...CONFIG.fxmaster.userSpecials.fxmaster.effects[0],
                position: {
                  x: game.canvas.dimensions.width / 2,
                  y: game.canvas.dimensions.height / 2,
                },
                elevation: 1,
              };
              game.socket.emit(`module.${packageId}`, data);
              await game.canvas.specials.playVideo(data);
            }
          },
        },
        {
          id: "playing-options",
          selector: "#specials-config .directory-header",
          title: "FXMASTER.TourSpecialEffectsPlayingOptionsTitle",
          content: "FXMASTER.TourSpecialEffectsPlayingOptionsContent",
          layer: "specials",
          tooltipDirection: "LEFT",
          _preStep: async () => {
            await this.#renderAppIfNeeded();
            await this.#selectFirstEffect();
          },
        },
      ],
      suggestedNextTours: ["fxmaster.particleEffects"],
    });
  }

  /** @type {SpecialEffectsManagement|undefined} */
  #app;

  async #renderApp() {
    this.#app =
      Object.values(ui.windows).find((app) => app instanceof SpecialEffectsManagement) ??
      new SpecialEffectsManagement();
    await this.#app._render(true);
  }

  async #renderAppIfNeeded() {
    if (!Object.values(ui.windows).some((app) => app instanceof SpecialEffectsManagement)) {
      this.#app = new SpecialEffectsManagement();
      await this.#app._render(true);
    }
  }

  async #selectFirstEffect() {
    const folderHeader = await waitForElement('[data-folder-id="fxmaster"] .folder-header');
    if (folderHeader.parentElement.classList.contains("collapsed")) {
      folderHeader.click();
    }
    const effectDescription = await waitForElement('[data-folder-id="fxmaster"] [data-effect-id="0"] .description');
    effectDescription.click();
  }
}
