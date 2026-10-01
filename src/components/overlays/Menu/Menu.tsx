"use client";

import { cloneElement, useLayoutEffect, useRef, useState, type ReactElement, type Ref } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
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
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
  type Placement,
} from "@floating-ui/react";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";
import { overlayAttribute, portalRoot } from "../floating";

export type MenuItem = {
  label: string;
  icon?: PhosphorIcon;
  onSelect: () => void;
  /**
   * For something that cannot be undone, such as deleting: shown in red.
   */
  danger?: boolean;
  disabled?: boolean;
};

export type MenuProps = {
  /**
   * The button that opens it, such as an IconButton with three dots.
   */
  trigger: ReactElement<{ ref?: Ref<Element> }>;
  items: MenuItem[];
  placement?: Placement;
};

/**
 * A list of actions behind a button, such as the actions on a table row.
 * Follows the ARIA menu pattern: the arrow keys, Home and End move between
 * the items, typing a letter jumps to an item, Enter chooses one, and
 * Escape closes it.
 */
export function Menu({ trigger, items, placement = "bottom-end" }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const itemElements = useRef<Array<HTMLElement | null>>([]);
  const labels = useRef<Array<string | null>>([]);

  useLayoutEffect(() => {
    labels.current = items.map((item) => item.label);
  }, [items]);

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
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const disabledIndices = items.flatMap((item, index) => (item.disabled ? [index] : []));

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context, { role: "menu" }),
    useListNavigation(context, {
      listRef: itemElements,
      activeIndex,
      onNavigate: setActiveIndex,
      disabledIndices,
      loop: true,
    }),
    useTypeahead(context, {
      listRef: labels,
      activeIndex,
      onMatch: open ? setActiveIndex : undefined,
    }),
  ]);

  const ref = useMergeRefs([setReference, trigger.props.ref]);

  const choose = (item: MenuItem) => {
    setOpen(false);
    item.onSelect();
  };

  return (
    <>
      {cloneElement(trigger, getReferenceProps({ ref }))}
      {open && (
        <FloatingPortal root={portalRoot(elements.domReference)}>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={setFloating}
              {...overlayAttribute}
              style={floatingStyles}
              className="z-50 flex min-w-44 flex-col rounded-card border border-border bg-surface p-1 shadow-lg outline-none"
              {...getFloatingProps()}
            >
              {items.map((item, index) => (
                <button
                  key={item.label}
                  ref={(element) => {
                    itemElements.current[index] = element;
                  }}
                  type="button"
                  role="menuitem"
                  tabIndex={activeIndex === index ? 0 : -1}
                  disabled={item.disabled}
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-control px-2 text-left text-sm whitespace-nowrap outline-none",
                    "focus:bg-surface-elevated disabled:opacity-50",
                    item.danger ? "text-error-soft-foreground" : "text-foreground",
                  )}
                  {...getItemProps({ onClick: () => choose(item) })}
                >
                  {item.icon && <Icon icon={item.icon} size="sm" />}
                  {item.label}
                </button>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
