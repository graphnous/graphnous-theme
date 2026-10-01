import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";

import { Button } from "../../ui/Button/Button";
import { Code } from "../../ui/Code/Code";
import { Text } from "../../ui/Text/Text";

import { Drawer, type DrawerProps } from "./Drawer";

function WithTrigger(args: DrawerProps) {
  const [open, setOpen] = useState(args.open);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Show details
      </Button>
      <Drawer
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
  title: "Overlays/Drawer",
  component: Drawer,
  args: {
    open: false,
    onClose: fn(),
    title: "ScanController",
    description: "Class in dev.graphnous.api",
    children: (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 30 }, (_, index) => (
          <Text key={index} size="sm">
            Method <Code>method{index}()</Code>
          </Text>
        ))}
      </div>
    ),
  },
  render: (args) => <WithTrigger {...args} />,
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};

export const WithFooter: Story = {
  args: {
    open: true,
    size: "lg",
    footer: <Button variant="secondary">Open in the graph</Button>,
  },
};

export const OpenedAndClosed: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Show details" });

    await userEvent.click(trigger);
    const drawer = canvas.getByRole("dialog", { name: "ScanController" });
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAccessibleDescription("Class in dev.graphnous.api");

    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(drawer).not.toBeVisible());
    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(trigger).toHaveFocus();
  },
};

export const ClosedWithEscape: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show details" }));
    await expect(canvas.getByRole("dialog")).toBeVisible();

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};
