/**
 * Given the width of a text measured at a reference font size, return the
 * font size that makes it exactly fill `containerWidth`.
 */
export function fitFontSize(measuredWidth: number, containerWidth: number, reference = 100): number {
  if (!(measuredWidth > 0) || !(containerWidth > 0)) return reference;
  return (reference * containerWidth) / measuredWidth;
}

/** Measure an element at the reference size and apply the fitted size. */
export function fitElement(el: HTMLElement, containerWidth: number, reference = 100): number {
  el.style.fontSize = `${reference}px`;
  const measured = el.scrollWidth;
  const size = Math.floor(fitFontSize(measured, containerWidth, reference) * 100) / 100;
  el.style.fontSize = `${size}px`;
  return size;
}
