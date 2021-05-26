export const resetFlags = function (document, flaglabel, newFlags) {
    const oldFlags = document.getFlag("fxmaster", flaglabel);
    const keys = oldFlags ? Object.keys(oldFlags) : [];
    keys.forEach((k) => {
        if (newFlags[k]) return;
        newFlags[`-=${k}`] = null;
    });
    return document.setFlag("fxmaster", flaglabel, newFlags);
}