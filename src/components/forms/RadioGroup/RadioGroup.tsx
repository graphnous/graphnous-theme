"use client";

import { useId, type ReactNode } from "react";
import { WarningCircleIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";
import { ChoiceText } from "../Checkbox/Checkbox";

export type RadioOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type RadioGroupProps = {
  /**
   * The question the options answer.
   */
  label: ReactNode;
  /**
   * The name the chosen value has in a form.
   */
  name: string;
  options: RadioOption[];
  /**
   * The chosen value, when the parent controls it; otherwise defaultValue.
   */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * Choosing one of a few options that are all shown, such as a scan's
 * source. The browser's radio buttons: the arrow keys move between them.
 */
export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  description,
  error,
  required = false,
  disabled = false,
  className,
}: RadioGroupProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={[description && descriptionId, error && errorId].filter(Boolean).join(" ") || undefined}
      className={cn("flex flex-col gap-1.5", className)}
    >
      <legend className={cn("mb-1.5 text-sm font-medium text-foreground", disabled && "opacity-50")}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-error-soft-foreground">
            {" *"}
          </span>
        )}
      </legend>
      <div className="flex flex-col gap-2.5">
        {options.map((option) => {
          const optionId = `${id}-${option.value}`;
          const optionDescriptionId = `${optionId}-description`;

          return (
            <div
              key={option.value}
              className={cn("flex items-start gap-2.5", (disabled || option.disabled) && "opacity-50")}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                required={required}
                disabled={option.disabled}
                aria-describedby={option.description ? optionDescriptionId : undefined}
                data-invalid={error ? "" : undefined}
                {...(value === undefined
                  ? { defaultChecked: defaultValue === option.value }
                  : { checked: value === option.value })}
                onChange={() => onValueChange?.(option.value)}
                className={cn(
                  "mt-0.5 size-4 shrink-0 appearance-none rounded-full border border-border-strong bg-surface transition-colors",
                  "checked:border-[5px] checked:border-primary disabled:cursor-not-allowed data-invalid:border-error",
                )}
              />
              <ChoiceText
                htmlFor={optionId}
                label={option.label}
                description={option.description}
                descriptionId={optionDescriptionId}
              />
            </div>
          );
        })}
      </div>
      {description && (
        <p id={descriptionId} className="text-xs text-foreground-secondary">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1 text-xs font-medium text-error-soft-foreground">
          <Icon icon={WarningCircleIcon} size="xs" weight="fill" />
          {error}
        </p>
      )}
    </fieldset>
  );
}
