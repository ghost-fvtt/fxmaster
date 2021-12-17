import { isV9OrLater, resetFlags } from "./utils.js";
import { logger } from "./logger.js";

export const targetServerMigration = 2;
export const targetClientMigration = 1;

export async function migrate() {
  await migrateClient();
  if (game.user.isGM) {
    await migrateWolrd();
  }
}

async function migrateWolrd() {
  const migration = game.settings.get("fxmaster", "migration");
  if (migration === -1) {
    return game.settings.set("fxmaster", "migration", targetServerMigration);
  }

  if (migration < targetServerMigration) {
    ui.notifications.info("FXMASTER.MigrationWorldStart", { localize: true, permanent: true });
    let isError = false;

    switch (migration) {
      case 0:
      case 1:
        isError |= await migrateWorld1to2();
    }

    if (isError) {
      await game.settings.set("fxmaster", "disableAll", true);
      ui.notifications.error("FXMASTER.MigrationWorldCompletedWithErrors", { localize: true, permanent: true });
    } else {
      ui.notifications.info("FXMASTER.MigrationWorldCompletedSuccessfully", { localize: true, permanent: true });
    }
    await game.settings.set("fxmaster", "migration", targetServerMigration);
  }
}

async function migrateWorld1to2() {
  let isError = false;

  const migrateScene = async (scene) => {
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
  };

  for (const scene of game.scenes) {
    logger.debug(`Migrating Scene '${scene.name}' (${scene.id}).`);
    try {
      await migrateScene(scene);
    } catch (e) {
      logger.error(`Migration of Scene '${scene.name}' (${scene.id}) failed.`, e);
      isError = true;
    }
  }

  const migrateSceneCompendium = async (pack) => {
    const type = isV9OrLater() ? pack.metadata.type : pack.metadata.entity;
    if (type !== "Scene") {
      return;
    }

    const wasLocked = pack.locked;
    await pack.configure({ locked: false });

    await pack.migrate();
    const scenes = await pack.getDocuments();

    for (const scene of scenes) {
      logger.debug(`Migrating Scene '${scene.name}' (${scene.id}) in compendium ${pack.collection}.`);
      try {
        await migrateScene(scene);
      } catch (e) {
        logger.error(`Migration of Scene '${scene.name}' (${scene.id}) in compendium ${pack.collection} failed.`, e);
        isError = true;
      }
    }

    await pack.configure({ locked: wasLocked });
  };

  for (const pack of game.packs) {
    const type = isV9OrLater() ? pack.metadata.type : pack.metadata.entity;
    if (pack.metadata.package !== "world" || type !== "Scene") continue;
    await migrateSceneCompendium(pack);
  }

  return isError;
}

async function migrateClient() {
  const migration = game.settings.get("fxmaster", "clientMigration");
  if (migration === -1) {
    return game.settings.set("fxmaster", "clientMigration", targetClientMigration);
  }

  if (migration < targetClientMigration) {
    ui.notifications.info("FXMASTER.MigrationClientStart", { permanent: true, localize: true });
    let isError = false;

    switch (migration) {
      case 0:
        isError |= await migrateClient0to1();
    }

    if (isError) {
      ui.notifications.error("FXMASTER.MigrationClientCompletedWithErrors", { localize: true, permanent: true });
    } else {
      ui.notifications.info("FXMASTER.MigrationClientCompletedSuccessfully", { localize: true, permanent: true });
    }
    await game.settings.set("fxmaster", "clientMigration", targetClientMigration);
  }
}

async function migrateClient0to1() {
  const effects = game.settings.get("fxmaster", "specialEffects");
  for (let i = 0; i < effects.length; ++i) {
    if (typeof effects[i].scale !== "object") {
      effects[i].scale = {
        x: effects[i].scale,
        y: effects[i].scale,
      };
    }
  }
  await game.settings.set("fxmaster", "specialEffects", effects);
  return false;
}

export function isOnTargetMigration() {
  return (
    game.settings.get("fxmaster", "migration") === targetServerMigration &&
    game.settings.get("fxmaster", "clientMigration") === targetClientMigration
  );
}

/**
 * Schedule a callback to be executed as soon as the world has been migrated to the target migration. If it is on the
 * latest migration already, the callback is executed immediately. Callbacks are executed in the order in that they have
 * been registered.
 * @param {() => (Promise<void> | void)} callback A callback to execute when the world is migrated
 */
export function executeWhenWorldIsMigratedToLatest(callback) {
  if (game.settings.get("fxmaster", "migration") !== targetServerMigration) {
    worldMigrationCallbacks.push(callback);
  } else {
    callback();
  }
}

/** @type {Array<() => (Promise<void> | void)>} */
const worldMigrationCallbacks = [];

export async function onWorldMigrated() {
  if (game.settings.get("fxmaster", "migration") === targetServerMigration) {
    for (const callback of worldMigrationCallbacks) {
      await callback();
    }
  }
}
