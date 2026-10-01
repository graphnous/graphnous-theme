import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

export type DescriptionItem = {
  label: ReactNode;
  /**
   * Shown as a dash when missing, such as a scan that has not finished.
   */
  value: ReactNode;
};

export type DescriptionListProps = {
  items: DescriptionItem[];
  /**
   * stacked: each label above its value; inline: labels in a column next
   * to the values, from medium screens up.
   */
  layout?: "stacked" | "inline";
  className?: string;
};

/**
 * Labels and values, such as the details of a system, project or scan.
 */
export function DescriptionList({ items, layout = "inline", className }: DescriptionListProps) {
  return (
    <dl
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-3 text-sm",
        layout === "inline" && "md:grid-cols-[minmax(8rem,max-content)_1fr]",
        className,
      )}
    >
      {items.map((item, index) => {
        const missing = item.value === null || item.value === undefined || item.value === "";

        return (
          // Each pair lines up with the others through a subgrid
          <div
            key={index}
            className={cn("flex flex-col gap-0.5", layout === "inline" && "md:col-span-2 md:grid md:grid-cols-subgrid")}
          >
            <dt className="text-foreground-secondary">{item.label}</dt>
            <dd className="min-w-0 text-foreground">
              {missing ? <span className="text-foreground-muted">—</span> : item.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
