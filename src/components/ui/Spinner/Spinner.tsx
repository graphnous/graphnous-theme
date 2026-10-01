import { CircleNotchIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon, type IconSize } from "../Icon/Icon";

export type SpinnerProps = {
  size?: IconSize;
  /**
   * What is loading, for screen readers.
   */
  label?: string;
  className?: string;
};

/**
 * Shows that something is in progress, without saying how far along it is.
 */
export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex", className)}>
      <Icon icon={CircleNotchIcon} size={size} weight="bold" className="animate-spin motion-reduce:animate-none" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
