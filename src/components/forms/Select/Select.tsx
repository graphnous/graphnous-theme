"use client";

import type { ComponentPropsWithRef } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";
import { controlStyles } from "../controlStyles";
import { useFieldProps } from "../Field/Field";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Omit<ComponentPropsWithRef<"select">, "children" | "multiple"> & {
  options: SelectOption[];
  /**
   * Shown while nothing is chosen; it cannot be chosen itself.
   */
  placeholder?: string;
};

/**
 * Choosing one of a short list, in a Field, with the browser's own select,
 * which works well on phones and with the keyboard. For long lists, where
 * searching helps, use a Combobox.
 */
export function Select({ options, placeholder, className, defaultValue, ...props }: SelectProps) {
  const field = useFieldProps(props);

  return (
    <div className="relative flex items-center">
      <select
        {...props}
        {...field}
        defaultValue={defaultValue ?? (placeholder !== undefined && props.value === undefined ? "" : undefined)}
        className={cn(controlStyles, "h-10 appearance-none pr-9 pl-3", className)}
      >
        {placeholder !== undefined && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon icon={CaretDownIcon} size="sm" className="pointer-events-none absolute right-3 text-foreground-muted" />
    </div>
  );
}
