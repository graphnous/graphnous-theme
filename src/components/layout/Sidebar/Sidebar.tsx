import type { ReactNode } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";
import { RouterLink } from "../../ui/Link/LinkProvider";

export type SidebarProps = {
  /**
   * What the navigation is, for screen readers.
   */
  label?: string;
  className?: string;
  children: ReactNode;
};

/**
 * The app's navigation: groups of NavItems.
 */
export function Sidebar({ label = "Main", className, children }: SidebarProps) {
  return (
    <nav aria-label={label} className={cn("flex flex-col gap-6 p-3", className)}>
      {children}
    </nav>
  );
}

export type NavGroupProps = {
  title?: string;
  children: ReactNode;
};

export function NavGroup({ title, children }: NavGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      {title && <p className="px-3 pb-1 text-xs font-semibold text-foreground-muted uppercase">{title}</p>}
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  );
}

export type NavItemProps = {
  href: string;
  icon?: PhosphorIcon;
  /**
   * Whether the item is the current page; decided by the page, so the item
   * stays independent of the router.
   */
  active?: boolean;
  children: ReactNode;
};

export function NavItem({ href, icon, active = false, children }: NavItemProps) {
  return (
    <li>
      <RouterLink
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary-subtle text-foreground"
            : "text-foreground-secondary hover:bg-surface-elevated hover:text-foreground",
        )}
      >
        {icon && <Icon icon={icon} size="sm" weight={active ? "fill" : "regular"} className={active ? "text-primary" : undefined} />}
        <span className="truncate">{children}</span>
      </RouterLink>
    </li>
  );
}
