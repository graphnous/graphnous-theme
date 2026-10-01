import { cn } from "../../../lib/cn";

export type SkeletonProps = {
  /**
   * text: a line of text; block: a rectangle, such as a card; circle: an
   * avatar or icon.
   */
  shape?: "text" | "block" | "circle";
  /**
   * For text: the number of lines, the last one shorter.
   */
  lines?: number;
  className?: string;
};

const pulse = "animate-pulse bg-surface-elevated motion-reduce:animate-none";

/**
 * A placeholder in the shape of content that is loading. Hidden from
 * screen readers: mark the region that loads with aria-busy, and say what
 * loads with VisuallyHidden text.
 */
export function Skeleton({ shape = "text", lines = 1, className }: SkeletonProps) {
  if (shape === "text") {
    return (
      <div aria-hidden className={cn("flex flex-col gap-2", className)}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={cn(pulse, "h-3.5 rounded-sm", lines > 1 && index === lines - 1 ? "w-2/3" : "w-full")}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(pulse, shape === "circle" ? "size-10 rounded-full" : "h-24 w-full rounded-card", className)}
    />
  );
}
