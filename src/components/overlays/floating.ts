/**
 * Marks an open popover, menu or list of options, so a Dialog around it
 * leaves Escape to it instead of closing.
 */
export const overlayAttribute = { "data-overlay": "" };

/**
 * Where a floating element goes: into the modal dialog its trigger is in,
 * as the rest of the page is inert and behind the dialog; otherwise the
 * body. Positioned with the "fixed" strategy, the dialog does not clip it.
 */
export function portalRoot(reference: Element | null): HTMLElement | undefined {
  return reference?.closest("dialog") ?? undefined;
}
