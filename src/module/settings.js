import { onWorldMigrated } from "./migration.js";

export const registerSettings = function () {
  game.settings.register("fxmaster", "enable", {
    name: "FXMASTER.Enable",
    default: true,
    scope: "client",
    type: Boolean,
    config: true,
    onChange: debouncedReload,
  });

  game.settings.register("fxmaster", "specialEffects", {
    name: "specialEffects",
    default: [],
    scope: "world",
    type: Array,
    config: false,
  });

  game.settings.register("fxmaster", "migration", {
    name: "migration",
    default: 0,
    scope: "world",
    type: Number,
    config: false,
    onChange: onWorldMigrated,
  });

  game.settings.register("fxmaster", "clientMigration", {
    name: "clientMigration",
    default: 0,
    scope: "client",
    type: Number,
    config: false,
  });

  game.settings.register("fxmaster", "permission-create", {
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

  game.settings.register("fxmaster", "disableAll", {
    name: "FXMASTER.DisableAll",
    hint: "FXMASTER.DisableAllHint",
    default: false,
    scope: "world",
    type: Boolean,
    config: true,
  });
};

export const debouncedReload = foundry.utils.debounce(() => {
  window.location.reload();
}, 100);
