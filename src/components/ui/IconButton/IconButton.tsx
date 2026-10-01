import type { ComponentPropsWithRef } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

import { cn } from "../../../lib/cn";

import { buttonStyles, type ButtonSize, type ButtonVariant } from "../Button/buttonStyles";
import { Icon } from "../Icon/Icon";
import { Spinner } from "../Spinner/Spinner";

export type IconButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
  icon: PhosphorIcon;
  /**
   * What the button does; required, as the icon alone does not say it to
   * screen readers. Also shown as the native tooltip.
   */
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const squares: Record<ButtonSize, string> = {
  sm: "w-8 px-0",
  md: "w-10 px-0",
  lg: "w-12 px-0",
};

/**
 * A button with only an icon, such as "Delete" in a table row.
 */
export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  loading = false,
  disabled,
  type = "button",
  className,
  ...props
}: IconButtonProps) {
  const iconSize = size === "lg" ? "lg" : size === "md" ? "md" : "sm";

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, className: cn(squares[size], className) })}
      {...props}
    >
      {loading ? <Spinner size={iconSize} label="In progress" /> : <Icon icon={icon} size={iconSize} />}
    </button>
  );
}
