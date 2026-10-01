"use client";

import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { CheckIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";

export type CheckboxProps = Omit<ComponentPropsWithRef<"input">, "type"> & {
  label: ReactNode;
  /**
   * More about what it does, below the label.
   */
  description?: ReactNode;
};

/**
 * A choice that is on or off, with its own label; the browser's checkbox,
 * so it works in forms without a value of its own.
 */
export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const descriptionId = `${id}-description`;

  return (
    <div className={cn("flex items-start gap-2.5", props.disabled && "opacity-50", className)}>
      <span className="relative mt-0.5 flex size-4 shrink-0">
        <input
          type="checkbox"
          aria-describedby={description ? descriptionId : undefined}
          {...props}
          id={id}
          className={cn(
            "peer size-4 shrink-0 appearance-none rounded-[0.25rem] border border-border-strong bg-surface transition-colors",
            "checked:border-primary checked:bg-primary disabled:cursor-not-allowed",
            "aria-invalid:border-error",
          )}
        />
        <Icon
          icon={CheckIcon}
          size="xs"
          weight="bold"
          className="pointer-events-none absolute inset-0 m-auto hidden text-primary-foreground peer-checked:block"
        />
      </span>
      <ChoiceText htmlFor={id} label={label} description={description} descriptionId={descriptionId} />
    </div>
  );
}

/**
 * The label and description next to a checkbox, switch or radio button;
 * the description is outside the label, so it is not part of the name.
 */
export function ChoiceText({
  htmlFor,
  label,
  description,
  descriptionId,
}: {
  htmlFor: string;
  label: ReactNode;
  description?: ReactNode;
  descriptionId: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={htmlFor} className="text-sm text-foreground">
        {label}
      </label>
      {description && (
        <p id={descriptionId} className="text-xs text-foreground-secondary">
          {description}
        </p>
      )}
    </div>
  );
}
