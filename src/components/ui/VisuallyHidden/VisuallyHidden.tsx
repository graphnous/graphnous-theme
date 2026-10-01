import type { ReactNode } from "react";

/**
 * Text only for screen readers, such as the name of an icon-only control.
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
