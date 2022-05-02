import { isOnTargetWorldMigration, migrateWorld, worldMigrations } from "./world/migration.js";
import { clientMigrations, isOnTargetClientMigration, migrateClient } from "./client/migration.js";
import * as helpers from "./helpers.js";

export async function migrate() {
  await migrateClient();
  if (game.user.isGM) {
    await migrateWorld();
  }
}

export function isOnTargetMigration() {
  return isOnTargetWorldMigration() && isOnTargetClientMigration();
}

/**
 * Schedule a callback to be executed as soon as the world has been migrated to the target migration. If it is on the
 * latest migration already, the callback is executed immediately. Callbacks are executed in the order in that they have
 * been registered.
 * @param {() => (Promise<void> | void)} callback A callback to execute when the world is migrated
 */
export function executeWhenWorldIsMigratedToLatest(callback) {
  if (!isOnTargetWorldMigration()) {
    worldMigrationCallbacks.push(callback);
  } else {
    callback();
  }
}

/** @type {Array<() => (Promise<void> | void)>} */
const worldMigrationCallbacks = [];

export async function onWorldMigrated() {
  if (isOnTargetWorldMigration()) {
    while (worldMigrationCallbacks.length > 0) {
      const callback = worldMigrationCallbacks.shift();
      await callback();
    }
  }
}

export const migration = { client: clientMigrations, world: worldMigrations, helpers };
