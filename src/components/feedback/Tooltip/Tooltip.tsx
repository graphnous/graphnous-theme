"use client";

import { cloneElement, useId, useState, type ReactElement, type ReactNode, type Ref } from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
} from "@floating-ui/react";

import { portalRoot } from "../../overlays/floating";

export type TooltipProps = {
  /**
   * The extra detail, such as an exact timestamp or a full qualified name.
   */
  content: ReactNode;
  /**
   * The side it prefers; it moves to the other side, and along it, to stay
   * on screen.
   */
  side?: "top" | "bottom";
  /**
   * Milliseconds the pointer rests on the trigger before it shows.
   */
  delay?: number;
  /**
   * Leaves the element as it is, without a tooltip, such as text that is
   * not cut off.
   */
  disabled?: boolean;
  /**
   * The element it describes: something that can receive focus, such as a
   * button or a link, so keyboard users can reach it too.
   */
  children: ReactElement<{ "aria-describedby"?: string; ref?: Ref<Element> }>;
};

/**
 * Extra detail about an element, shown on hover and on keyboard focus, and
 * closed with Escape. Not for essential information: touch screens do not
 * hover.
 */
export function Tooltip({ content, side = "top", delay = 300, disabled = false, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const showing = open && !disabled;

  const {
    refs: { setReference, setFloating },
    elements,
    floatingStyles,
    context,
  } = useFloating({
    open: showing,
    strategy: "fixed",
    onOpenChange: setOpen,
    placement: side,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    // Only follows scrolling and resizing while it shows
    whileElementsMounted: showing ? autoUpdate : undefined,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { enabled: !disabled, delay: { open: delay, close: 0 }, move: false }),
    useFocus(context, { enabled: !disabled }),
    useDismiss(context, { enabled: !disabled }),
  ]);

  const ref = useMergeRefs([setReference, children.props.ref]);

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref, "aria-describedby": disabled ? undefined : id }))}
      {!disabled && (
        <FloatingPortal root={portalRoot(elements.domReference)}>
          {/* Always in the page, so the description is there before it shows */}
          <span
            ref={setFloating}
            id={id}
            role="tooltip"
            hidden={!showing}
            style={floatingStyles}
            className="z-40 w-max max-w-xs rounded-control border border-border bg-surface-elevated px-2.5 py-1.5 text-xs break-words text-foreground shadow-md"
            {...getFloatingProps()}
          >
            {content}
          </span>
        </FloatingPortal>
      )}
    </>
  );
}
