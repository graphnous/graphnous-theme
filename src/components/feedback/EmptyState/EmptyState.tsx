import type { ReactNode } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

import { cn } from "../../../lib/cn";

import { Heading, type HeadingLevel } from "../../ui/Heading/Heading";
import { Icon } from "../../ui/Icon/Icon";
import { Text } from "../../ui/Text/Text";

export type EmptyStateProps = {
  icon?: PhosphorIcon;
  title: ReactNode;
  level?: HeadingLevel;
  description?: ReactNode;
  /**
   * What to do about it, such as "Start a scan".
   */
  action?: ReactNode;
  className?: string;
};

/**
 * A list or page without content yet, and what to do about it.
 */
export function EmptyState({ icon, title, level = 3, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-surface-elevated text-foreground-secondary">
          <Icon icon={icon} size="lg" />
        </div>
      )}
      <div className="flex max-w-sm flex-col gap-1">
        <Heading level={level} size="sm">
          {title}
        </Heading>
        {description && (
          <Text as="div" size="sm" tone="secondary">
            {description}
          </Text>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
