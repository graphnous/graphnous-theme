import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";

import { Button } from "../../ui/Button/Button";
import { Text } from "../../ui/Text/Text";

import { Dialog, type DialogProps } from "./Dialog";

/**
 * Opens the dialog with a button, as a page would.
 */
function WithTrigger(args: DialogProps) {
  const [open, setOpen] = useState(args.open);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create project</Button>
      <Dialog
        {...args}
        open={open}
        onClose={() => {
          setOpen(false);
          args.onClose();
        }}
      />
    </>
  );
}

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  args: {
    open: false,
    onClose: fn(),
    title: "Create project",
    description: "A project groups the repositories that are scanned together.",
    children: <Text size="sm">The form to create a project goes here.</Text>,
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button>Create</Button>
      </>
    ),
  },
  render: (args) => <WithTrigger {...args} />,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};

export const Small: Story = {
  args: { open: true, size: "sm", description: undefined },
};

export const Large: Story = {
  args: { open: true, size: "lg" },
};

export const OpenedAndClosedWithTheKeyboard: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Create project" });

    await userEvent.click(trigger);
    const dialog = canvas.getByRole("dialog", { name: "Create project" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription("A project groups the repositories that are scanned together.");
    // The browser moves focus into it
    await expect(dialog).toContainElement(document.activeElement as HTMLElement);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(args.onClose).toHaveBeenCalledOnce();
    // And back to the button that opened it
    await expect(trigger).toHaveFocus();
  },
};

export const ClosedWithTheCloseButton: Story = {
  args: { open: true },
  play: async ({ args, canvas }) => {
    // Opened by an effect, which can run after the play function starts
    await canvas.findByRole("dialog");
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));

    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};

export const ClosedByClickingOutside: Story = {
  args: { open: true },
  play: async ({ args, canvas }) => {
    const dialog = await canvas.findByRole("dialog");

    // The backdrop is part of the dialog element, outside its content
    const { left, top } = dialog.getBoundingClientRect();
    await userEvent.pointer({ keys: "[MouseLeft]", target: dialog, coords: { clientX: left - 10, clientY: top - 10 } });

    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};

export const StaysOpenOnClicksInside: Story = {
  args: { open: true },
  play: async ({ args, canvas }) => {
    await canvas.findByRole("dialog");
    await userEvent.click(canvas.getByText("The form to create a project goes here."));

    await expect(canvas.getByRole("dialog")).toBeVisible();
    await expect(args.onClose).not.toHaveBeenCalled();
  },
};
