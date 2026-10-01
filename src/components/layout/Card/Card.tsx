import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

import { Heading, type HeadingLevel } from "../../ui/Heading/Heading";
import { Text } from "../../ui/Text/Text";

/**
 * A bordered surface holding one thing, such as a scan's summary.
 */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col rounded-card border border-border bg-surface", className)}>{children}</div>
  );
}

export type CardHeaderProps = {
  title: ReactNode;
  /**
   * The title's heading level in the page's outline.
   */
  level?: HeadingLevel;
  description?: ReactNode;
  /**
   * Controls on the right, such as a menu.
   */
  actions?: ReactNode;
  className?: string;
};

export function CardHeader({ title, level = 3, description, actions, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-border px-5 py-4", className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <Heading level={level} size="sm">
          {title}
        </Heading>
        {description && (
          <Text as="div" size="sm" tone="secondary">
            {description}
          </Text>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex items-center justify-end gap-2 border-t border-border px-5 py-3", className)}>
      {children}
    </div>
  );
}
