module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },

  env: {
    browser: true,
    es2021: true,
    jquery: true,
  },

  extends: ["eslint:recommended", "@typhonjs-fvtt/eslint-config-foundry.js/0.8.0", "plugin:prettier/recommended"],

  plugins: [],

  globals: {
    PIXI: "readonly",
    CachedContainer: "readonly",
    InverseOcclusionMaskFilter: "readonly",
    ParticleEffect: "readonly",
    InteractionLayer: "readonly",
    SpriteMesh: "readonly",
    FullCanvasContainer: "readonly",
  },

  rules: {
    "no-unused-vars": ["error", { vars: "all", args: "after-used", varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
  },

  overrides: [
    {
      files: ["./*.js", "./*.mjs", "./tools/**/*"],
      env: {
        node: true,
        browser: false,
      },
    },
  ],
};
