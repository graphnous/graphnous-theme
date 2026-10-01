"use client";

import { useId, type ReactNode } from "react";
import { XIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Heading } from "../../ui/Heading/Heading";
import { IconButton } from "../../ui/IconButton/IconButton";
import { Text } from "../../ui/Text/Text";
import { useModal } from "../useModal";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

export type DialogProps = {
  open: boolean;
  /**
   * Called on Escape, the close button or a click outside the dialog; the
   * parent closes it by setting open to false.
   */
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /**
   * The actions at the bottom, such as Cancel and Save.
   */
  footer?: ReactNode;
  size?: keyof typeof sizes;
  children?: ReactNode;
};

/**
 * A modal over the page, such as a form to create a project. Built on the
 * native <dialog>: focus stays inside it, the page behind is inert, and
 * focus returns to what opened it.
 */
export function Dialog({ open, onClose, title, description, footer, size = "md", children }: DialogProps) {
  const modal = useModal(open, onClose);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <dialog
      {...modal}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-dialog border border-border bg-surface p-0 text-foreground shadow-xl",
        "backdrop:bg-black/50 backdrop:backdrop-blur-[1px]",
        sizes[size],
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3">
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
          <IconButton icon={XIcon} label="Close" size="sm" onClick={onClose} className="-mt-1 -mr-2" />
        </div>
        {children && <div className="px-6 py-3">{children}</div>}
        {footer && <div className="flex justify-end gap-2 px-6 pt-3 pb-5">{footer}</div>}
      </div>
    </dialog>
  );
}
