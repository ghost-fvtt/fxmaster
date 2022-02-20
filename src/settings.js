import { packageId } from "./constants.js";
import { onWorldMigrated } from "./migration.js";

export const registerSettings = function () {
  game.settings.register(packageId, "enable", {
    name: "FXMASTER.Enable",
    default: true,
    scope: "client",
    type: Boolean,
    config: true,
    onChange: debouncedReload,
  });

  game.settings.register(packageId, "specialEffects", {
    name: "specialEffects",
    default: [],
    scope: "world",
    type: Array,
    config: false,
  });

  game.settings.register(packageId, "migration", {
    name: "migration",
    default: -1,
    scope: "world",
    type: Number,
    config: false,
    onChange: onWorldMigrated,
  });

  game.settings.register(packageId, "clientMigration", {
    name: "clientMigration",
    default: -1,
    scope: "client",
    type: Number,
    config: false,
  });

  game.settings.register(packageId, "permission-create", {
    name: "FXMASTER.PermissionCreate",
    hint: "FXMASTER.PermissionCreateHint",
    scope: "world",
    config: true,
    default: foundry.CONST.USER_ROLES.ASSISTANT,
    type: Number,
    choices: {
      [foundry.CONST.USER_ROLES.PLAYER]: "USER.RolePlayer",
      [foundry.CONST.USER_ROLES.TRUSTED]: "USER.RoleTrusted",
      [foundry.CONST.USER_ROLES.ASSISTANT]: "USER.RoleAssistant",
      [foundry.CONST.USER_ROLES.GAMEMASTER]: "USER.RoleGamemaster",
    },
    onChange: debouncedReload,
  });

  game.settings.register(packageId, "disableAll", {
    name: "FXMASTER.DisableAll",
    hint: "FXMASTER.DisableAllHint",
    default: false,
    scope: "world",
    type: Boolean,
    config: true,
  });
};

const debouncedReload = foundry.utils.debounce(() => {
  window.location.reload();
}, 100);
