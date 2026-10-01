"use client";

import type { ComponentPropsWithRef } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";
import { controlStyles } from "../controlStyles";
import { useFieldProps } from "../Field/Field";

export type TextInputProps = ComponentPropsWithRef<"input"> & {
  /**
   * Shown at the start, such as a link icon for a repository URL.
   */
  icon?: PhosphorIcon;
};

/**
 * A single line of text, in a Field.
 */
export function TextInput({ icon, type = "text", className, ...props }: TextInputProps) {
  const field = useFieldProps(props);

  return (
    <div className="relative flex items-center">
      {icon && (
        <Icon icon={icon} size="sm" className="pointer-events-none absolute left-3 text-foreground-muted" />
      )}
      <input
        type={type}
        {...props}
        {...field}
        className={cn(controlStyles, "h-10 px-3", icon && "pl-9", className)}
      />
    </div>
  );
}
