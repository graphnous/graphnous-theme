"use client";

import { useRef, useState, type ReactNode } from "react";
import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react/ssr";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";

import { cn } from "../../../lib/cn";

import { overlayAttribute, portalRoot } from "../../overlays/floating";
import { Icon } from "../../ui/Icon/Icon";
import { controlStyles } from "../controlStyles";
import { useField, useFieldProps } from "../Field/Field";

export type ComboboxOption = {
  value: string;
  label: string;
  /**
   * Shown below the label, such as a project's repository.
   */
  description?: ReactNode;
};

export type ComboboxProps = {
  options: ComboboxOption[];
  /**
   * The chosen value; null while nothing is chosen.
   */
  value: string | null;
  onValueChange: (value: string) => void;
  /**
   * The name the chosen value has in a form.
   */
  name?: string;
  placeholder?: string;
  /**
   * Shown when nothing matches what was typed.
   */
  emptyMessage?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

/**
 * Choosing one of a long list, in a Field, by typing to narrow it down.
 * Follows the ARIA combobox pattern: focus stays in the input, the arrow
 * keys move through the options, Enter chooses one and Escape closes the
 * list.
 */
export function Combobox({
  options,
  value,
  onValueChange,
  name,
  placeholder,
  emptyMessage = "No matches",
  disabled,
  required,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const items = useRef<Array<HTMLElement | null>>([]);
  const field = useField();
  const fieldProps = useFieldProps({ disabled, required });

  const selected = options.find((option) => option.value === value);
  const matches = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));

  const {
    refs: { setReference, setFloating },
    elements,
    floatingStyles,
    context,
  } = useFloating({
    open,
    onOpenChange: (next) => {
      setOpen(next);
      if (!next) {
        setQuery("");
      }
    },
    strategy: "fixed",
    placement: "bottom-start",
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.min(availableHeight, 288)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useRole(context, { role: "combobox" }),
    useDismiss(context),
    useListNavigation(context, {
      listRef: items,
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
      loop: true,
    }),
  ]);

  const choose = (option: ComboboxOption) => {
    onValueChange(option.value);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative flex items-center">
      <input
        {...fieldProps}
        ref={setReference}
        type="text"
        autoComplete="off"
        // While open it shows what was typed, and otherwise the chosen option
        value={open ? query : (selected?.label ?? "")}
        placeholder={open && selected ? selected.label : placeholder}
        className={cn(controlStyles, "h-10 pr-9 pl-3", className)}
        {...getReferenceProps({
          onChange: (event) => {
            setQuery((event.currentTarget as HTMLInputElement).value);
            setOpen(true);
            setActiveIndex(0);
          },
          onClick: () => setOpen(true),
          onKeyDown: (event) => {
            if (event.key === "Enter" && open && activeIndex !== null && matches[activeIndex]) {
              event.preventDefault();
              choose(matches[activeIndex]);
            }
          },
        })}
      />
      <Icon icon={CaretUpDownIcon} size="sm" className="pointer-events-none absolute right-3 text-foreground-muted" />
      {name && <input type="hidden" name={name} value={value ?? ""} />}
      {open && (
        <FloatingPortal root={portalRoot(elements.domReference)}>
          <div
            ref={setFloating}
            {...overlayAttribute}
            aria-labelledby={field?.labelId}
            style={floatingStyles}
            className="z-50 flex flex-col overflow-y-auto rounded-card border border-border bg-surface p-1 shadow-lg outline-none"
            {...getFloatingProps()}
          >
            {matches.length === 0 && (
              <div role="option" aria-disabled="true" aria-selected="false" className="px-2 py-1.5 text-sm text-foreground-muted">
                {emptyMessage}
              </div>
            )}
            {matches.map((option, index) => (
              <div
                key={option.value}
                ref={(element) => {
                  items.current[index] = element;
                }}
                className={cn(
                  "flex cursor-default items-center gap-2 rounded-control px-2 py-1.5 text-sm text-foreground",
                  activeIndex === index && "bg-surface-elevated",
                )}
                {...getItemProps({
                  active: activeIndex === index,
                  selected: option.value === value,
                  onClick: () => choose(option),
                })}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{option.label}</span>
                  {option.description && (
                    <span className="truncate text-xs text-foreground-secondary">{option.description}</span>
                  )}
                </span>
                {option.value === value && <Icon icon={CheckIcon} size="sm" className="text-primary" />}
              </div>
            ))}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}
