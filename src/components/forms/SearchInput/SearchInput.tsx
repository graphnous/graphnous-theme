"use client";

import { useEffect, useRef, useState, type ComponentPropsWithRef } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import { controlStyles } from "../controlStyles";
import { useField, useFieldProps } from "../Field/Field";

export type SearchInputProps = Omit<
  ComponentPropsWithRef<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  /**
   * What it searches, for screen readers, such as "Search projects"; not
   * needed in a Field, whose label names it.
   */
  label?: string;
  defaultValue?: string;
  /**
   * Called with what was typed once typing pauses, and right away when it
   * is cleared.
   */
  onSearch: (query: string) => void;
  /**
   * Milliseconds typing pauses before it searches.
   */
  delay?: number;
};

/**
 * A search box for filtering a list, such as the projects. Clears with its
 * button or Escape.
 */
export function SearchInput({
  label,
  defaultValue = "",
  onSearch,
  delay = 300,
  placeholder = "Search",
  className,
  ...props
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);
  const inField = useField() !== null;
  const field = useFieldProps(props);

  useEffect(() => () => clearTimeout(timer.current), []);

  const change = (next: string) => {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(next), delay);
  };

  const clear = () => {
    setValue("");
    clearTimeout(timer.current);
    onSearch("");
    input.current?.focus();
  };

  return (
    <div className="relative flex items-center">
      <Icon icon={MagnifyingGlassIcon} size="sm" className="pointer-events-none absolute left-3 text-foreground-muted" />
      <input
        ref={input}
        type="search"
        aria-label={inField ? undefined : (label ?? placeholder)}
        placeholder={placeholder}
        {...props}
        {...field}
        value={value}
        onChange={(event) => change(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            // Clears the search, rather than closing a dialog around it
            event.preventDefault();
            event.stopPropagation();
            clear();
          }
          props.onKeyDown?.(event);
        }}
        className={cn(
          controlStyles,
          "h-10 pr-10 pl-9 [&::-webkit-search-cancel-button]:appearance-none",
          className,
        )}
      />
      {value && (
        <IconButton icon={XIcon} label="Clear search" size="sm" onClick={clear} className="absolute right-1" />
      )}
    </div>
  );
}
