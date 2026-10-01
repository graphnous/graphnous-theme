import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyIcon } from "@phosphor-icons/react/ssr";
import { expect, screen, userEvent, waitFor } from "storybook/test";

import { Button } from "../../ui/Button/Button";
import { IconButton } from "../../ui/IconButton/IconButton";

import { Tooltip } from "./Tooltip";

const meta = {
  title: "Feedback/Tooltip",
  component: Tooltip,
  args: {
    content: "30 September 2026, 18:41:07",
    children: <Button variant="ghost">5 minutes ago</Button>,
  },
  render: (args) => (
    <div className="flex h-32 items-end justify-center">
      <Tooltip {...args} />
    </div>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Below: Story = {
  args: { side: "bottom" },
  render: (args) => (
    <div className="flex h-32 items-start justify-center">
      <Tooltip {...args} />
    </div>
  ),
};

/**
 * Near the edge of the screen, it moves along its side to stay on it.
 */
export const AtTheEdge: Story = {
  args: { content: "graphnous-server/src/main/java/dev/graphnous/api/ScanController.java" },
  render: (args) => (
    <div className="flex h-32 items-end justify-start">
      <Tooltip {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab();
    const tooltip = screen.getByRole("tooltip", { hidden: true });
    await waitFor(() => expect(tooltip).toBeVisible());
    await waitFor(() => expect(tooltip.getBoundingClientRect().left).toBeGreaterThanOrEqual(0));
    await expect(canvas.getByRole("button")).toHaveFocus();
  },
};

export const OnAnIconButton: Story = {
  args: {
    content: "Copy the scan's id",
    children: <IconButton icon={CopyIcon} label="Copy id" variant="secondary" />,
  },
};

export const OpenedWithTheKeyboard: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "5 minutes ago" });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    const tooltip = screen.getByRole("tooltip", { hidden: true });
    await waitFor(() => expect(tooltip).toBeVisible());
    // The trigger is described by the tooltip
    await expect(trigger).toHaveAccessibleDescription("30 September 2026, 18:41:07");

    await userEvent.keyboard("{Escape}");
    await expect(tooltip).not.toBeVisible();
  },
};

export const OpenedByHovering: Story = {
  play: async ({ canvas }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "5 minutes ago" }));
    await waitFor(() => expect(screen.getByRole("tooltip", { hidden: true })).toBeVisible());

    await userEvent.unhover(canvas.getByRole("button", { name: "5 minutes ago" }));
    await expect(screen.getByRole("tooltip", { hidden: true })).not.toBeVisible();
  },
};
