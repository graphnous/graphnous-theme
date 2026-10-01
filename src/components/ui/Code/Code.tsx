import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

/**
 * Inline code, such as an id, a qualified name or a revision.
 */
export function Code({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <code className={cn("rounded-sm bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.9em]", className)}>
      {children}
    </code>
  );
}

export type CodeBlockProps = {
  /**
   * Wraps long lines instead of scrolling them horizontally.
   */
  wrap?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Lines of code or output, such as a stack trace or a manifest.
 */
export function CodeBlock({ wrap = false, className, children }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-card border border-border bg-surface-elevated p-4 font-mono text-sm",
        wrap && "break-words whitespace-pre-wrap",
        className,
      )}
    >
      <code>{children}</code>
    </pre>
  );
}
