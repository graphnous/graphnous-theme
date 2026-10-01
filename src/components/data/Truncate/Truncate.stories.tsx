import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor } from "storybook/test";

import { Truncate } from "./Truncate";

const name = "dev.graphnous.application.enhancer.model.EnhancerManifestSchema";

const meta = {
  title: "Data/Truncate",
  component: Truncate,
  args: { children: name },
  render: (args) => (
    <div className="flex h-24 w-64 items-end text-sm">
      <Truncate {...args} />
    </div>
  ),
} satisfies Meta<typeof Truncate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const End: Story = {
  play: async ({ canvas }) => {
    const text = canvas.getByText(name);

    // Cut off, so it can be focused to show the full text
    await waitFor(() => expect(text).toHaveAttribute("tabindex", "0"));
    await userEvent.tab();
    await expect(text).toHaveFocus();
    await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent(name));
  },
};

export const Start: Story = {
  args: { from: "start" },
};

export const Fits: Story = {
  args: { children: "ScanController" },
  play: async ({ canvas }) => {
    const text = canvas.getByText("ScanController");

    await expect(text).not.toHaveAttribute("tabindex");
    await expect(screen.queryByRole("tooltip", { hidden: true })).toBeNull();
  },
};

export const GitUrl: Story = {
  args: { children: "https://github.com/spring-projects/spring-petclinic.git", from: "start" },
};
