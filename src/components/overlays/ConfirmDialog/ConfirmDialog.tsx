"use client";

import type { ReactNode } from "react";

import { Button } from "../../ui/Button/Button";
import { Dialog } from "../Dialog/Dialog";

export type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  /**
   * What will happen, such as what else is deleted with it.
   */
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /**
   * For something that cannot be undone, such as deleting: the confirm
   * button is red.
   */
  danger?: boolean;
  /**
   * While what was confirmed is in progress: the confirm button shows a
   * spinner and the dialog cannot be closed.
   */
  confirming?: boolean;
  /**
   * Why it did not work, such as the API's 409 message.
   */
  error?: ReactNode;
};

/**
 * Asks to confirm an action before it happens, such as deleting a scan.
 * Cancel comes first and has focus when it opens, so Enter does not
 * confirm by accident.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  confirming = false,
  error,
}: ConfirmDialogProps) {
  const close = () => {
    if (!confirming) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={confirming} data-autofocus>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={confirming}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {error}
    </Dialog>
  );
}
