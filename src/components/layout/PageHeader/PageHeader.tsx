import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

import { Heading } from "../../ui/Heading/Heading";
import { Text } from "../../ui/Text/Text";
import { Breadcrumbs, type Breadcrumb } from "../Breadcrumbs/Breadcrumbs";

export type PageHeaderProps = {
  /**
   * The page's h1.
   */
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Breadcrumb[];
  /**
   * The page's main actions, such as "New project".
   */
  actions?: ReactNode;
  /**
   * Details under the title, such as a status badge.
   */
  meta?: ReactNode;
  className?: string;
};

/**
 * The top of every page: where it is, what it is and what can be done.
 */
export function PageHeader({ title, description, breadcrumbs, actions, meta, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <Heading level={1} size="lg">
            {title}
          </Heading>
          {description && (
            <Text as="div" tone="secondary">
              {description}
            </Text>
          )}
          {meta && <div className="flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
