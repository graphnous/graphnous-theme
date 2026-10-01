import type { Meta, StoryObj } from "@storybook/react-vite";
import { FunnelIcon } from "@phosphor-icons/react/ssr";
import { expect, fn, screen, userEvent, waitFor } from "storybook/test";

import { Button } from "../../ui/Button/Button";
import { Text } from "../../ui/Text/Text";

import { Popover } from "./Popover";

const meta = {
  title: "Overlays/Popover",
  component: Popover,
  args: {
    label: "Filters",
    onOpenChange: fn(),
    trigger: (
      <Button variant="secondary" icon={FunnelIcon}>
        Filters
      </Button>
    ),
    children: (
      <div className="flex flex-col gap-3">
        <Text size="sm" weight="medium">
          Show scans that
        </Text>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked /> Completed
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" /> Failed
        </label>
        <Button size="sm">Apply</Button>
      </div>
    ),
  },
  render: (args) => (
    <div className="flex h-64 items-start justify-center">
      <Popover {...args} />
    </div>
  ),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};

/**
 * Near the bottom of the screen, it opens above the button.
 */
export const AtTheBottom: Story = {
  render: (args) => (
    <div className="flex h-[calc(100dvh-2rem)] items-end justify-start">
      <Popover {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Filters" });
    await userEvent.click(trigger);

    const popover = screen.getByRole("dialog", { name: "Filters" });
    await waitFor(() =>
      expect(popover.getBoundingClientRect().bottom).toBeLessThanOrEqual(trigger.getBoundingClientRect().top),
    );
  },
};

export const OpenedAndClosed: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Filters" });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const popover = screen.getByRole("dialog", { name: "Filters" });
    // It takes focus, so the keyboard continues inside it
    await waitFor(() => expect(screen.getByRole("checkbox", { name: "Completed" })).toHaveFocus());
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(popover).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};

export const ClosedByClickingOutside: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    await expect(screen.getByRole("dialog", { name: "Filters" })).toBeVisible();

    await userEvent.click(canvasElement);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};
