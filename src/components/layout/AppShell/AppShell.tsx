import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

export type AppShellProps = {
  /**
   * The bar at the top, such as the logo and account.
   */
  header: ReactNode;
  /**
   * The navigation beside the content on wide screens, above it on narrow
   * ones.
   */
  sidebar?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * The frame around every page: header, navigation and the main content.
 */
export function AppShell({ header, sidebar, className, children }: AppShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-background", className)}>
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b border-border bg-surface px-4">
        {header}
      </header>
      <div className="flex flex-1 flex-col md:flex-row">
        {sidebar && (
          <aside className="shrink-0 border-b border-border bg-surface md:w-60 md:border-r md:border-b-0">
            {sidebar}
          </aside>
        )}
        <main className="min-w-0 flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
