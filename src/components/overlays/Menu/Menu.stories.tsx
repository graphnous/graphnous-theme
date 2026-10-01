import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowClockwiseIcon, DotsThreeIcon, DownloadSimpleIcon, StopIcon, TrashIcon } from "@phosphor-icons/react/ssr";
import { expect, fn, screen, userEvent, waitFor } from "storybook/test";

import { IconButton } from "../../ui/IconButton/IconButton";
import { Dialog } from "../Dialog/Dialog";

import { Menu } from "./Menu";

const onDialogClose = fn();

const meta = {
  title: "Overlays/Menu",
  component: Menu,
  args: {
    trigger: <IconButton icon={DotsThreeIcon} label="Scan actions" variant="secondary" />,
    items: [
      { label: "Scan again", icon: ArrowClockwiseIcon, onSelect: fn() },
      { label: "Download results", icon: DownloadSimpleIcon, onSelect: fn() },
      { label: "Cancel", icon: StopIcon, onSelect: fn(), disabled: true },
      { label: "Delete", icon: TrashIcon, onSelect: fn(), danger: true },
    ],
  },
  render: (args) => (
    <div className="flex h-64 items-start justify-center">
      <Menu {...args} />
    </div>
  ),
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Opened: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Scan actions" }));

    await expect(screen.getByRole("menu", { name: "Scan actions" })).toBeVisible();
    await expect(screen.getAllByRole("menuitem")).toHaveLength(4);
    await expect(screen.getByRole("menuitem", { name: "Cancel" })).toBeDisabled();
  },
};

export const ChosenWithTheMouse: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Scan actions" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Download results" }));

    await expect(args.items[1].onSelect).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
};

export const ChosenWithTheKeyboard: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Scan actions" });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Scan again" })).toHaveFocus());

    await userEvent.keyboard("{ArrowDown}");
    await expect(screen.getByRole("menuitem", { name: "Download results" })).toHaveFocus();

    // Skips the disabled item
    await userEvent.keyboard("{ArrowDown}");
    await expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();

    // Loops around
    await userEvent.keyboard("{ArrowDown}");
    await expect(screen.getByRole("menuitem", { name: "Scan again" })).toHaveFocus();

    await userEvent.keyboard("{End}");
    await expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();

    await userEvent.keyboard("{Home}");
    await expect(screen.getByRole("menuitem", { name: "Scan again" })).toHaveFocus();

    // Typing jumps to the item that starts with it
    await userEvent.keyboard("d");
    await expect(screen.getByRole("menuitem", { name: "Download results" })).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await expect(args.items[1].onSelect).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const ClosedWithEscape: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Scan actions" });

    await userEvent.click(trigger);
    await expect(screen.getByRole("menu")).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await expect(trigger).toHaveFocus();
    for (const item of args.items) {
      await expect(item.onSelect).not.toHaveBeenCalled();
    }
  },
};

/**
 * In a dialog, Escape closes the menu first and the dialog second.
 */
export const InADialog: Story = {
  render: (args) => (
    <Dialog open onClose={onDialogClose} title="Scan">
      <Menu {...args} />
    </Dialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Scan actions" }));
    const menu = screen.getByRole("menu");
    // Inside the dialog, as the page behind it is inert
    await expect(canvas.getByRole("dialog")).toContainElement(menu);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await expect(onDialogClose).not.toHaveBeenCalled();

    await userEvent.keyboard("{Escape}");
    await expect(onDialogClose).toHaveBeenCalledOnce();
  },
};
