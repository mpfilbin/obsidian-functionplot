/** The pixel size of a plot. */
export interface PlotSize {
  width: number;
  height: number;
}

/** Plot height as a fraction of its width. */
const ASPECT = 0.62;
/** The plot is never taller than this fraction of the window. */
const MAX_HEIGHT_RATIO = 0.6;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 140;

/**
 * Work out how big the preview plot should be, given the width it can occupy
 * and the height of the window.
 * @param containerWidth The width available to the plot, in pixels
 * @param windowHeight The height of the window, in pixels
 * @returns The plot size, in whole pixels
 */
export function previewSize(
  containerWidth: number,
  windowHeight: number
): PlotSize {
  const width = Math.max(MIN_WIDTH, Math.floor(containerWidth));
  const maxHeight = Math.max(
    MIN_HEIGHT,
    Math.floor(windowHeight * MAX_HEIGHT_RATIO)
  );
  const height = Math.min(
    Math.max(MIN_HEIGHT, Math.round(width * ASPECT)),
    maxHeight
  );
  return { width, height };
}

/**
 * Measure the plot size that fits the given element right now.
 * @param el The element the plot is rendered into
 * @returns The plot size
 */
export function measurePreviewSize(el: HTMLElement): PlotSize {
  const win = el.ownerDocument.defaultView ?? window;
  return previewSize(el.clientWidth, win.innerHeight);
}

/**
 * Call `onChange` whenever the element or its window is resized enough to
 * change the plot size.
 * @param el The element the plot is rendered into
 * @param initial The size the plot currently has (no callback is made for it)
 * @param onChange Called with the new size
 * @returns A function that stops observing
 */
export function observePreviewSize(
  el: HTMLElement,
  initial: PlotSize,
  // eslint-disable-next-line no-unused-vars
  onChange: (size: PlotSize) => void
): () => void {
  const win = el.ownerDocument.defaultView ?? window;
  let last = initial;

  const update = () => {
    const size = measurePreviewSize(el);
    // ignore sub-pixel jitter, which could otherwise cause resize loops
    if (Math.abs(size.width - last.width) < 2 && size.height === last.height) {
      return;
    }
    last = size;
    onChange(size);
  };

  // The element's width follows the modal, the height cap follows the window.
  const observer = new ResizeObserver(update);
  observer.observe(el);
  win.addEventListener("resize", update);

  return () => {
    observer.disconnect();
    win.removeEventListener("resize", update);
  };
}
