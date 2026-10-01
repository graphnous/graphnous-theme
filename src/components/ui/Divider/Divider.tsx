import { cn } from "../../../lib/cn";

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

/**
 * A line between groups of content, such as toolbar actions.
 */
export function Divider({ orientation = "horizontal", className }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        className,
      )}
    />
  );
}
