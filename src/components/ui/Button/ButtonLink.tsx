import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

import { Icon } from "../Icon/Icon";
import { RouterLink, type RouterLinkProps } from "../Link/LinkProvider";

import { buttonStyles, type ButtonSize, type ButtonVariant } from "./buttonStyles";

export type ButtonLinkProps = RouterLinkProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: PhosphorIcon;
  iconEnd?: PhosphorIcon;
  fullWidth?: boolean;
};

/**
 * A link that looks like a button, for actions that go to another page,
 * such as "New project".
 */
export function ButtonLink({
  variant,
  size = "md",
  icon,
  iconEnd,
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const iconSize = size === "lg" ? "md" : "sm";

  return (
    <RouterLink className={buttonStyles({ variant, size, fullWidth, className })} {...props}>
      {icon && <Icon icon={icon} size={iconSize} />}
      {children}
      {iconEnd && <Icon icon={iconEnd} size={iconSize} />}
    </RouterLink>
  );
}
