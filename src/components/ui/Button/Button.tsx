import type { ComponentPropsWithRef } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

import { Icon } from "../Icon/Icon";
import { Spinner } from "../Spinner/Spinner";

import { buttonStyles, type ButtonSize, type ButtonVariant } from "./buttonStyles";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Shown before the text.
   */
  icon?: PhosphorIcon;
  /**
   * Shown after the text, such as an arrow.
   */
  iconEnd?: PhosphorIcon;
  /**
   * Shows a spinner instead of the icon and disables the button, while
   * what it started is in progress.
   */
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  variant,
  size = "md",
  icon,
  iconEnd,
  loading = false,
  fullWidth,
  disabled,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  const iconSize = size === "lg" ? "md" : "sm";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading ? <Spinner size={iconSize} label="In progress" /> : icon && <Icon icon={icon} size={iconSize} />}
      {children}
      {iconEnd && <Icon icon={iconEnd} size={iconSize} />}
    </button>
  );
}
