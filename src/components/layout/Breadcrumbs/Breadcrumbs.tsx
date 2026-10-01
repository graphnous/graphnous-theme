import { CaretRightIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";
import { RouterLink } from "../../ui/Link/LinkProvider";

export type Breadcrumb = {
  label: string;
  /**
   * Leave it out for the current page, the last crumb.
   */
  href?: string;
};

export type BreadcrumbsProps = {
  items: Breadcrumb[];
  className?: string;
};

/**
 * Where the page is, such as system, project, scan; the last crumb is the
 * current page.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li key={`${index}-${item.label}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && <Icon icon={CaretRightIcon} size="xs" className="text-foreground-muted" />}
              {item.href && !current ? (
                <RouterLink
                  href={item.href}
                  className="truncate rounded-sm text-foreground-secondary hover:text-foreground hover:underline"
                >
                  {item.label}
                </RouterLink>
              ) : (
                <span
                  aria-current={current ? "page" : undefined}
                  className={cn("truncate", current ? "font-medium text-foreground" : "text-foreground-secondary")}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
