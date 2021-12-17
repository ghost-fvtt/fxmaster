export const resetFlags = function (document, flaglabel, newFlags) {
  const oldFlags = document.getFlag("fxmaster", flaglabel);
  const keys = oldFlags ? Object.keys(oldFlags) : [];
  keys.forEach((k) => {
    if (newFlags[k]) return;
    newFlags[`-=${k}`] = null;
  });
  return document.setFlag("fxmaster", flaglabel, newFlags);
};

export function formatString(format, ...args) {
  return format.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
}

export function isV9OrLater() {
  return game.release?.generation ?? 0 >= 9;
}
