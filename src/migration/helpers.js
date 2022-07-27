import { logger } from "../logger.js";

/**
 * Migrate a world collection.
 * @param {WorldCollection} collection The world collection to migrate
 * @param {(document: Document) => Promise<void>} migrateDocument The function to use for updating a single document
 * @returns {Promise<boolean>} Whether or not there was an error during the migration
 */
export async function migrateWorldCollection(collection, migrateDocument) {
  let isError = false;

  for (const document of collection) {
    logger.debug(`Migrating ${collection.documentName} '${document.name}' (${document.id}).`);
    try {
      await migrateDocument(document);
    } catch (e) {
      logger.error(`Migration of ${collection.documentName} '${document.name}' (${document.id}) failed.`, e);
      isError = true;
    }
  }

  return isError;
}

/**
 * Migrate a compendium pack.
 * @param {CompendiumCollection} pack The compendium pack to migrate
 * @param {(document: Document) => Promise<void>} migrateDocument The function to use for updating a single document
 * @returns {Promise<boolean>} Whether or not there was an error during the migration
 */
export async function migrateCompendiumCollection(pack, migrateDocument) {
  let isError = false;

  const type = pack.metadata.type;

  const wasLocked = pack.locked;
  await pack.configure({ locked: false });

  const documents = await pack.getDocuments();

  for (const document of documents) {
    logger.debug(`Migrating ${type} '${document.name}' (${document.id}) in compendium ${pack.collection}.`);
    try {
      await migrateDocument(document);
    } catch (e) {
      logger.error(
        `Migration of ${type} '${document.name}' (${document.id}) in compendium ${pack.collection} failed.`,
        e,
      );
      isError = true;
    }
  }

  await pack.configure({ locked: wasLocked });

  return isError;
}

/** @typedef {Record<string, (document: Document) => Promise<void>} MigrationConfiguration */

/**
 * Migrate the given world collections according to the given migration configuration.
 * @param {Iterable<WorldCollection>} collections            The world collections to migrate
 * @param {MigrationConfiguration}    migrationConfiguration The configuration for the migration
 * @returns {Promise<boolean>} Whether or not there was an error during the migration
 */
export async function migrateWorldCollections(collections, migrationConfiguration) {
  let isError = false;

  for (const collection of collections) {
    const type = collection.documentName;
    if (!(type in migrationConfiguration)) {
      continue;
    }
    isError |= await migrateWorldCollection(collection, migrationConfiguration[type]);
  }

  return isError;
}

/** @typedef {{migrateNonWorldPacks?: boolean}} MigrateCompendiumCollectionsOptions */

/**
 * Migrate the given compoendium packs according to the given migration configuration.
 * @param {Iterable<CompendiumCollection>}      collections            The compendium packs to migrate
 * @param {MigrationConfiguration}              migrationConfiguration The configuration for the migration
 * @param {MigrateCompendiumCollectionsOptions} [options={}]           Additional options for the migration
 * @returns {Promise<boolean>} Whether or not there was an error during the migration
 */
export async function migrateCompendiumCollections(
  packs,
  migrationConfiguration,
  { migrateNonWorldPacks = false } = {},
) {
  let isError = false;

  for (const pack of packs) {
    const type = pack.metadata.type;
    if ((pack.metadata.package !== "world" && !migrateNonWorldPacks) || !(type in migrationConfiguration)) {
      continue;
    }
    isError |= await migrateCompendiumCollection(pack, migrationConfiguration[type]);
  }

  return isError;
}

/**
 * Perform a migration for the given migration configuration.
 * @param {MigrationConfiguration} migrationConfiguration The configuration for the migration
 * @returns {Promise<boolean>} Whether or not there was an error during the migration
 */
export async function migrate(migrationConfiguration) {
  let isError = false;
  isError |= await migrateWorldCollections(game.collections, migrationConfiguration);
  isError |= await migrateCompendiumCollections(game.packs, migrationConfiguration);
  return isError;
}
