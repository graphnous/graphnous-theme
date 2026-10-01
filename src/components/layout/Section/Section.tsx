import { useId, type ReactNode } from "react";

import { cn } from "../../../lib/cn";

import { Heading, type HeadingLevel } from "../../ui/Heading/Heading";
import { Text } from "../../ui/Text/Text";

export type SectionProps = {
  title: ReactNode;
  level?: HeadingLevel;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * A titled part of a page, such as a project's scans. Named by its title,
 * so screen readers can jump to it.
 */
export function Section({ title, level = 2, description, actions, className, children }: SectionProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <Heading level={level} size="md">
            <span id={titleId}>{title}</span>
          </Heading>
          {description && (
            <Text as="div" size="sm" tone="secondary">
              {description}
            </Text>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
