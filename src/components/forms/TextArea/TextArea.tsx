"use client";

import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../lib/cn";

import { controlStyles } from "../controlStyles";
import { useFieldProps } from "../Field/Field";

export type TextAreaProps = ComponentPropsWithRef<"textarea">;

/**
 * Several lines of text, in a Field, such as a description.
 */
export function TextArea({ rows = 4, className, ...props }: TextAreaProps) {
  const field = useFieldProps(props);

  return (
    <textarea rows={rows} {...props} {...field} className={cn(controlStyles, "resize-y px-3 py-2", className)} />
  );
}
