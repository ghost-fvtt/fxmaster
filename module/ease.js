export function easeLinear(x) {
    return x;
}

export function easeInSine(x) {
    return 1 - Math.cos((x * Math.PI) / 2);
}

export function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

export function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function easeInBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * x * x * x - c1 * x * x;
}

export function easeInOutCirc(x) {
    return x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;

}