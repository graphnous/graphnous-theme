"use client";

import { createContext, useContext, useId, type ReactNode } from "react";
import { WarningCircleIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";

type FieldContextValue = {
  id: string;
  labelId: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
};

/**
 * Joins element ids for aria-describedby; undefined if there are none.
 */
function ids(...values: Array<string | false | undefined>): string | undefined {
  return values.filter(Boolean).join(" ") || undefined;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * The Field a control is in, if any.
 */
export function useField(): FieldContextValue | null {
  return useContext(FieldContext);
}

type ControlProps = {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
};

/**
 * The props that link a control to its Field: its id for the label, its
 * description and error, required and disabled. What the control sets
 * itself wins.
 */
export function useFieldProps(props: ControlProps): ControlProps {
  const field = useField();

  return {
    id: props.id ?? field?.id,
    disabled: props.disabled ?? field?.disabled,
    required: props.required ?? field?.required,
    "aria-describedby": ids(props["aria-describedby"], field?.describedBy),
    "aria-invalid": props["aria-invalid"] ?? (field?.invalid || undefined),
  };
}

export type FieldProps = {
  label: ReactNode;
  /**
   * Help with filling it in, such as the format of a value.
   */
  description?: ReactNode;
  /**
   * What is wrong with the value; marks the control as invalid.
   */
  error?: ReactNode;
  /**
   * Marks the label with an asterisk and the control as required.
   */
  required?: boolean;
  disabled?: boolean;
  /**
   * Hides the label, but not from screen readers; for a control whose
   * purpose is clear from the page around it.
   */
  hideLabel?: boolean;
  className?: string;
  /**
   * One control, such as a TextInput, Select or Combobox.
   */
  children: ReactNode;
};

/**
 * A label, a control, a description and an error, linked for screen
 * readers: the label names the control and the description and error
 * describe it.
 */
export function Field({
  label,
  description,
  error,
  required = false,
  disabled = false,
  hideLabel = false,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const describedBy = ids(Boolean(description) && descriptionId, Boolean(error) && errorId);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        id={labelId}
        htmlFor={id}
        className={cn("text-sm font-medium text-foreground", disabled && "opacity-50", hideLabel && "sr-only")}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-error-soft-foreground">
            {" *"}
          </span>
        )}
      </label>
      <FieldContext value={{ id, labelId, describedBy, invalid: Boolean(error), required, disabled }}>
        {children}
      </FieldContext>
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
    </div>
  );
}
