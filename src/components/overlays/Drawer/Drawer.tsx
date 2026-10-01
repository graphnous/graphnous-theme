"use client";

import { useId, type ReactNode } from "react";
import { XIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Heading } from "../../ui/Heading/Heading";
import { IconButton } from "../../ui/IconButton/IconButton";
import { Text } from "../../ui/Text/Text";
import { useModal } from "../useModal";

const widths = {
  md: "max-w-md",
  lg: "max-w-2xl",
} as const;

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof widths;
  children?: ReactNode;
};

/**
 * A panel from the right, for details without leaving a list, such as a
 * node of the graph. A modal like Dialog, on the native <dialog>.
 */
export function Drawer({ open, onClose, title, description, footer, size = "md", children }: DrawerProps) {
  const modal = useModal(open, onClose);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <dialog
      {...modal}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "m-0 ml-auto h-dvh max-h-none w-full border-l border-border bg-surface p-0 text-foreground shadow-xl",
        "backdrop:bg-black/40",
        widths[size],
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="flex min-w-0 flex-col gap-1">
            <Heading level={2} size="md">
              <span id={titleId}>{title}</span>
            </Heading>
            {description && (
              <Text as="div" size="sm" tone="secondary">
                <span id={descriptionId}>{description}</span>
              </Text>
            )}
          </div>
          <IconButton icon={XIcon} label="Close" size="sm" onClick={onClose} className="-mr-2" />
        </div>
        {/* Focusable, so the keyboard can scroll it */}
        <div tabIndex={0} className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        {footer && <div className="flex justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </dialog>
  );
}
