import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";

import { Alert } from "../../feedback/Alert/Alert";
import { Button } from "../../ui/Button/Button";

import { ConfirmDialog, type ConfirmDialogProps } from "./ConfirmDialog";

function WithTrigger(args: ConfirmDialogProps) {
  const [open, setOpen] = useState(args.open);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete scan
      </Button>
      <ConfirmDialog
        {...args}
        open={open}
        onClose={() => {
          setOpen(false);
          args.onClose();
        }}
        onConfirm={() => {
          setOpen(false);
          args.onConfirm();
        }}
      />
    </>
  );
}

const meta = {
  title: "Overlays/ConfirmDialog",
  component: ConfirmDialog,
  args: {
    open: false,
    onClose: fn(),
    onConfirm: fn(),
    title: "Delete this scan?",
    description: "Its steps, logs and results are deleted too. This cannot be undone.",
    confirmLabel: "Delete scan",
    danger: true,
  },
  render: (args) => <WithTrigger {...args} />,
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  args: { open: true },
};

export const NotDangerous: Story = {
  args: {
    open: true,
    danger: false,
    title: "Scan again?",
    description: "The repository is checked out and scanned from the start.",
    confirmLabel: "Scan",
  },
};

export const Confirming: Story = {
  args: { open: true, confirming: true },
};

export const Failed: Story = {
  args: {
    open: true,
    error: <Alert tone="error">The scan is still running. Cancel it before deleting it.</Alert>,
  },
};

export const Confirmed: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Delete scan" }));
    const dialog = canvas.getByRole("dialog", { name: "Delete this scan?" });

    // Cancel has focus, so Enter does not delete by accident
    await expect(canvas.getByRole("button", { name: "Cancel" })).toHaveFocus();

    await userEvent.click(canvas.getAllByRole("button", { name: "Delete scan" }).at(-1)!);
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await expect(args.onClose).not.toHaveBeenCalled();
  },
};

export const Cancelled: Story = {
  args: { open: true },
  play: async ({ args, canvas }) => {
    // Opened by an effect, which can run after the play function starts
    await canvas.findByRole("dialog");
    await userEvent.keyboard("{Enter}");

    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

export const CannotBeClosedWhileConfirming: Story = {
  args: { open: true, confirming: true },
  play: async ({ args, canvas }) => {
    await canvas.findByRole("dialog");
    await userEvent.keyboard("{Escape}");

    await expect(canvas.getByRole("dialog")).toBeVisible();
    await expect(args.onClose).not.toHaveBeenCalled();
  },
};
