import type { ReactNode } from "react";
import { ArrowClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Button } from "../../ui/Button/Button";
import { Heading, type HeadingLevel } from "../../ui/Heading/Heading";
import { Icon } from "../../ui/Icon/Icon";
import { Text } from "../../ui/Text/Text";

export type ErrorStateProps = {
  title?: ReactNode;
  level?: HeadingLevel;
  /**
   * What went wrong, such as the API's error message.
   */
  description?: ReactNode;
  /**
   * Shows a "Try again" button that calls it.
   */
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
};

/**
 * Content that failed to load, with a way to try again.
 */
export function ErrorState({
  title = "Something went wrong",
  level = 3,
  description,
  onRetry,
  retrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center gap-3 rounded-card border border-border px-6 py-12 text-center", className)}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-error-soft text-error-soft-foreground">
        <Icon icon={WarningCircleIcon} size="lg" />
      </div>
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
      {onRetry && (
        <Button variant="secondary" icon={ArrowClockwiseIcon} loading={retrying} onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
