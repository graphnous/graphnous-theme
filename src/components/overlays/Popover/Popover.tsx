"use client";

import { cloneElement, useState, type ReactElement, type ReactNode, type Ref } from "react";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
  type Placement,
} from "@floating-ui/react";

import { cn } from "../../../lib/cn";

import { overlayAttribute, portalRoot } from "../floating";

export type PopoverProps = {
  /**
   * The button that opens it.
   */
  trigger: ReactElement<{ ref?: Ref<Element> }>;
  /**
   * What the popover is, for screen readers, such as "Filters".
   */
  label: string;
  /**
   * The side it prefers; it moves to stay on screen.
   */
  placement?: Placement;
  /**
   * Controls it from the parent, such as closing it after applying a
   * filter; it opens and closes itself without these.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: ReactNode;
};

/**
 * A small panel attached to a button, such as filters or the details of a
 * graph node. It takes focus when it opens and closes with Escape or a
 * click outside it, returning focus to the button.
 */
export function Popover({
  trigger,
  label,
  placement = "bottom-start",
  open: controlledOpen,
  onOpenChange,
  className,
  children,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const {
    refs: { setReference, setFloating },
    elements,
    floatingStyles,
    context,
  } = useFloating({
    open,
    strategy: "fixed",
    onOpenChange: setOpen,
    placement,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context, { role: "dialog" }),
  ]);

  const ref = useMergeRefs([setReference, trigger.props.ref]);

  return (
    <>
      {cloneElement(trigger, getReferenceProps({ ref }))}
      {open && (
        <FloatingPortal root={portalRoot(elements.domReference)}>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={setFloating}
              {...overlayAttribute}
              aria-label={label}
              style={floatingStyles}
              className={cn(
                "z-50 w-max max-w-sm rounded-card border border-border bg-surface p-4 text-sm text-foreground shadow-lg outline-none",
                className,
              )}
              {...getFloatingProps()}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
