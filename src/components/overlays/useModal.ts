"use client";

import { useEffect, useRef, type ComponentPropsWithRef } from "react";

/**
 * Opens and closes a native <dialog> as a modal with `open`: spread the
 * props it returns on the <dialog>. The browser keeps focus inside it,
 * makes the rest of the page inert and returns focus to what opened it.
 * Escape and a click on the backdrop call onClose; the parent closes it by
 * setting open to false.
 *
 * It focuses the element marked with data-autofocus when it opens, or else
 * the first one that can be focused.
 */
export function useModal(open: boolean, onClose: () => void): ComponentPropsWithRef<"dialog"> {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;

    if (!element) {
      return;
    }

    if (open && !element.open) {
      element.showModal();
      element.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && element.open) {
      element.close();
    }
  }, [open]);

  // A popover, menu or list of options open inside the dialog closes first
  const closeUnlessOverlayOpen = () => {
    if (!dialog.current?.querySelector("[data-overlay]")) {
      onClose();
    }
  };

  return {
    ref: dialog,
    // Escape: handled here rather than by the browser, which would close
    // the dialog itself while open is still true
    onKeyDown: (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeUnlessOverlayOpen();
      }
    },
    onCancel: (event) => {
      event.preventDefault();
      closeUnlessOverlayOpen();
    },
    // A click on the backdrop lands on the dialog element itself
    onClick: (event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
  };
}
