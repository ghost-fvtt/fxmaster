/**
 * If the area of the intersection between the Rectangles `a` and `b` is not zero,
 * returns the area of intersection as a Rectangle object. Otherwise, returns an empty Rectangle
 * with its properties set to zero.
 * Rectangles without area (width or height equal to zero) can't intersect or be intersected
 * and will always return an empty rectangle with its properties set to zero.
 *
 * @method intersects
 * @memberof PIXI.Rectangle#
 * @param {Rectangle} a - The Rectangle to intersect with `b`.
 * @param {Rectangle} b - The Rectangle to intersect with `a`.
 * @param {Rectangle} [outRect] - A Rectangle object in which to store the value,
 * optional (otherwise will create a new Rectangle).
 * @returns {Rectangle} The intersection of `a` and `b`.
 * @remarks Incorporated from https://github.com/pixijs/pixijs/tree/dev/packages/math-extras
 * @license MIT
 */
export function intersectRectangles(a, b, outRect) {
  if (!outRect) {
    outRect = new PIXI.Rectangle();
  }

  const x0 = a.x < b.x ? b.x : a.x;
  const x1 = a.right > b.right ? b.right : a.right;

  if (x1 <= x0) {
    outRect.x = outRect.y = outRect.width = outRect.height = 0;

    return outRect;
  }

  const y0 = a.y < b.y ? b.y : a.y;
  const y1 = a.bottom > b.bottom ? b.bottom : a.bottom;

  if (y1 <= y0) {
    outRect.x = outRect.y = outRect.width = outRect.height = 0;

    return outRect;
  }

  outRect.x = x0;
  outRect.y = y0;
  outRect.width = x1 - x0;
  outRect.height = y1 - y0;

  return outRect;
}
