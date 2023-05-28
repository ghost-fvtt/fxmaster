/* eslint-disable no-fallthrough */
import { packageId } from "../../constants.js";
import { migrate2, migrationConfiguration2 } from "./2.js";
import { migrate3, migrationConfiguration3 } from "./3.js";
import { migrate4, migrationConfiguration4 } from "./4.js";

export const targetServerMigration = 4;

export async function migrateWorld() {
  const migration = game.settings.get(packageId, "migration");
  if (migration === -1) {
    return game.settings.set(packageId, "migration", targetServerMigration);
  }

  if (migration < targetServerMigration) {
    ui.notifications.info("FXMASTER.MigrationWorldStart", { localize: true, permanent: true });
    let isError = false;

    switch (migration) {
      case 0:
      case 1:
        isError |= await migrate2();
      case 2:
        isError |= await migrate3();
      case 3:
        isError |= await migrate4();
    }

    if (isError) {
      await game.settings.set(packageId, "disableAll", true);
      ui.notifications.error("FXMASTER.MigrationWorldCompletedWithErrors", { localize: true, permanent: true });
    } else {
      ui.notifications.info("FXMASTER.MigrationWorldCompletedSuccessfully", { localize: true, permanent: true });
    }
    await game.settings.set(packageId, "migration", targetServerMigration);
  }
}

export function isOnTargetWorldMigration() {
  return game.settings.get(packageId, "migration") === targetServerMigration;
}

export const worldMigrations = {
  2: {
    migrate: migrate2,
    config: migrationConfiguration2,
  },
  3: {
    migrate: migrate3,
    config: migrationConfiguration3,
  },
  4: {
    migrate: migrate4,
    config: migrationConfiguration4,
  },
};
