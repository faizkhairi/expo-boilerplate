module.exports = function (api) {
  api.cache(true);
  return {
    // nativewind/babel is a preset (it returns its own plugin list), not a
    // plugin; listing it under plugins fails Babel's validation.
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
