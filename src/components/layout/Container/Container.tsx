import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

const widths = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  full: "max-w-none",
} as const;

export type ContainerProps = {
  size?: keyof typeof widths;
  className?: string;
  children: ReactNode;
};

/**
 * The width of a page's content, centred, with side padding.
 */
export function Container({ size = "xl", className, children }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widths[size], className)}>{children}</div>;
}
