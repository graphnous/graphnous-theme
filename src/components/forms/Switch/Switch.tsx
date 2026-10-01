"use client";

import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

import { cn } from "../../../lib/cn";

import { ChoiceText } from "../Checkbox/Checkbox";

export type SwitchProps = Omit<ComponentPropsWithRef<"input">, "type"> & {
  label: ReactNode;
  description?: ReactNode;
};

/**
 * A setting that takes effect when it is turned on or off, such as
 * enabling an enhancer. A checkbox to the browser and in forms; a switch to
 * screen readers.
 */
export function Switch({ label, description, className, ...props }: SwitchProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const descriptionId = `${id}-description`;

  return (
    <div className={cn("flex items-start gap-2.5", props.disabled && "opacity-50", className)}>
      <span className="relative flex h-5 w-9 shrink-0">
        <input
          type="checkbox"
          role="switch"
          aria-describedby={description ? descriptionId : undefined}
          {...props}
          id={id}
          className={cn(
            "peer h-5 w-9 shrink-0 appearance-none rounded-full border border-border-strong bg-surface-elevated transition-colors",
            "checked:border-primary checked:bg-primary disabled:cursor-not-allowed",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1 left-1 size-3 rounded-full bg-foreground-secondary transition-transform",
            "peer-checked:translate-x-4 peer-checked:bg-primary-foreground",
          )}
        />
      </span>
      <ChoiceText htmlFor={id} label={label} description={description} descriptionId={descriptionId} />
    </div>
  );
}
