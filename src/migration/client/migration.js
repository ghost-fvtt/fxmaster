import { packageId } from "../../constants.js";
import { migrate1 } from "./1.js";

export const targetClientMigration = 1;

export async function migrateClient() {
  const migration = game.settings.get(packageId, "clientMigration");
  if (migration === -1) {
    return game.settings.set(packageId, "clientMigration", targetClientMigration);
  }

  if (migration < targetClientMigration) {
    ui.notifications.info("FXMASTER.MigrationClientStart", { permanent: true, localize: true });
    let isError = false;

    switch (migration) {
      case 0:
        isError |= await migrate1();
    }

    if (isError) {
      ui.notifications.error("FXMASTER.MigrationClientCompletedWithErrors", { localize: true, permanent: true });
    } else {
      ui.notifications.info("FXMASTER.MigrationClientCompletedSuccessfully", { localize: true, permanent: true });
    }
    await game.settings.set(packageId, "clientMigration", targetClientMigration);
  }
}

export function isOnTargetClientMigration() {
  return game.settings.get(packageId, "clientMigration") === targetClientMigration;
}

export const clientMigrations = {
  1: {
    migrate: migrate1,
  },
};
