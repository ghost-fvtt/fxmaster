import "../../../css/particle-effects-config.css";

import { packageId } from "../../constants.js";
import { FXMasterBaseForm } from "../../base-form.js";
import { resetFlag } from "../../utils.js";

export class ParticleEffectsManagement extends FXMasterBaseForm {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form", "fxmaster", "particle-effects", "sidebar-popout"],
      closeOnSubmit: false,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 300,
      height: "auto",
      template: "modules/fxmaster/templates/particle-effects-management.hbs",
      id: "effects-config",
      title: game.i18n.localize("FXMASTER.ParticleEffectsManagementTitle"),
    });
  }

  /** @override */
  getData() {
    const currentParticleEffects = canvas.scene?.getFlag(packageId, "effects") ?? {};

    const activeParticleEffects = Object.fromEntries(
      Object.values(currentParticleEffects).map((effect) => [effect.type, effect.options]),
    );

    /** @type {import("../particle-effects-db.js").ParticleEffects} */
    const { particleEffects } = CONFIG.fxmaster;

    /** @type {Record<string, {label: string, expanded: boolean, effects: import("../particle-effects-db.js").ParticleEffects}>}} */
    const initialParticleEffectGroups = {};

    const particleEffectGroups = Object.entries(particleEffects)
      .sort(([, clsA], [, clsB]) => clsA.group.localeCompare(clsB.group) || clsA.label.localeCompare(clsB.label))
      .reduce((groups, [type, cls]) => {
        const group = cls.group;
        return {
          ...groups,
          [group]: {
            label: `FXMASTER.ParticleEffectsGroup${group.titleCase()}`,
            expanded: groups[group]?.expanded || Object.keys(activeParticleEffects).includes(type),
            effects: {
              ...groups[group]?.effects,
              [type]: cls,
            },
          },
        };
      }, initialParticleEffectGroups);

    return {
      particleEffectGroups,
      effects: particleEffects,
      activeEffects: activeParticleEffects,
    };
  }

  /** @override */
  async _updateObject(_, formData) {
    /** @type {import("../particle-effects-db.js").ParticleEffects} */
    const { particleEffects } = CONFIG.fxmaster;
    const effects = Object.fromEntries(
      Object.entries(particleEffects)
        .filter(([type]) => !!formData[type])
        .map(([type, particleEffectCls]) => {
          const label = particleEffectCls.label;

          const options = Object.fromEntries(
            Object.entries(particleEffectCls.parameters).map(([key, parameter]) => {
              const optionValue =
                parameter.type === "color"
                  ? { apply: formData[`${label}_${key}_apply`], value: formData[`${label}_${key}`] }
                  : formData[`${label}_${key}`];

              return [key, optionValue];
            }),
          );

          const particleEffect = {
            type,
            options,
          };
          return [`core_${type}`, particleEffect];
        }),
    );
    resetFlag(canvas.scene, "effects", effects);
  }
}
