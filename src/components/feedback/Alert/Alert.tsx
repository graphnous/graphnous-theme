import type { ReactNode } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { XIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import { toneIcons, toneSurfaces, type Tone } from "../tones";

export type AlertProps = {
  tone?: Tone;
  title?: ReactNode;
  /**
   * Overrides the tone's icon.
   */
  icon?: PhosphorIcon;
  /**
   * An action, such as a link or button, below the message.
   */
  action?: ReactNode;
  /**
   * Shows a close button that calls it.
   */
  onDismiss?: () => void;
  /**
   * Announces the alert to screen readers when it appears; for alerts that
   * appear after something the user did, not for ones that are part of the
   * page from the start.
   */
  announce?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * A message within the page, such as why a scan cannot be deleted yet.
 */
export function Alert({
  tone = "info",
  title,
  icon,
  action,
  onDismiss,
  announce = false,
  className,
  children,
}: AlertProps) {
  const role = announce ? (tone === "error" || tone === "warning" ? "alert" : "status") : undefined;

  return (
    <div role={role} className={cn("flex gap-3 rounded-card border p-4 text-sm", toneSurfaces[tone], className)}>
      <Icon icon={icon ?? toneIcons[tone]} size="md" weight="fill" className="mt-px" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-foreground">{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onDismiss && (
        <IconButton icon={XIcon} label="Dismiss" size="sm" onClick={onDismiss} className="-my-1 -mr-1 text-current" />
      )}
    </div>
  );
}
