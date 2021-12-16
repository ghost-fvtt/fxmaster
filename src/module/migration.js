import { resetFlags } from "./utils.js";

export const targetServerMigration = 2;
export const targetClientMigration = 1;

export async function migrate() {
  migrateClient();
  if (game.user.isGM) {
    await migrateWolrd();
  }
}

async function migrateWolrd() {
  const migration = game.settings.get("fxmaster", "migration");
  if (migration < targetServerMigration) {
    ui.notifications.info("FXMASTER.MigrationWorldStart", { localize: true });

    try {
      switch (migration) {
        case 0:
        case 1:
          await migrateWorld1to2();
      }
    } catch (e) {
      ui.notifications.error("FXMASTER.MigrationWorldError", { localize: true, permanent: true });
      console.error("Error during world migration for FXMaster.", e);
    }

    await game.settings.set("fxmaster", "migration", 2);
  }
}

async function migrateWorld1to2() {
  for (const scene of game.scenes) {
    const weatherEffects = scene.getFlag("fxmaster", "effects") ?? {};
    if (Object.keys(weatherEffects).length > 0) {
      const newWeatherEffects = Object.fromEntries(
        Object.entries(weatherEffects).map(([id, effect]) => {
          const weatherEffectClass = CONFIG.fxmaster.weather[effect.type];
          return [id, { ...effect, options: weatherEffectClass.convertOptionsToV2(effect.options, scene) }];
        }),
      );
      await resetFlags(scene, "effects", newWeatherEffects);
    }
  }

  // TODO: Migrate compendium packs
}

function migrateClient() {
  const migration = game.settings.get("fxmaster", "clientMigration");

  if (migration < targetClientMigration) {
    ui.notifications.info("FXMASTER.MigrationClientStart", { localize: true });

    try {
      switch (migration) {
        case 0:
          migrateClient0to1();
      }
    } catch (e) {
      ui.notifications.error("FXMASTER.MigrationWorldError", { localize: true, permanent: true });
      console.error("Error during client migration for FXMaster.", e);
    }

    game.settings.set("fxmaster", "clientMigration", 1);
  }
}

function migrateClient0to1() {
  const effects = game.settings.get("fxmaster", "specialEffects");
  for (let i = 0; i < effects.length; ++i) {
    if (typeof effects[i].scale !== "object") {
      effects[i].scale = {
        x: effects[i].scale,
        y: effects[i].scale,
      };
    }
  }
  game.settings.set("fxmaster", "specialEffects", effects);
}

export function isOnTargetMigration() {
  return (
    game.settings.get("fxmaster", "migration") === targetServerMigration &&
    game.settings.get("fxmaster", "clientMigration") === targetClientMigration
  );
}
