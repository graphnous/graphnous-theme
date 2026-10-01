import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "Feedback/ProgressBar",
  component: ProgressBar,
  args: { label: "Uploading results", value: 40, showValue: true },
  render: (args) => (
    <div className="max-w-md">
      <ProgressBar {...args} />
    </div>
  ),
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Uploading results" });

    await expect(bar).toHaveAttribute("aria-valuenow", "40");
    await expect(canvas.getByText("40%")).toBeVisible();
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <ProgressBar label="Storing results" value={70} />
      <ProgressBar label="Upload complete" value={100} tone="success" showValue />
      <ProgressBar label="Upload failed" value={35} tone="error" />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { label: "Enhancing", value: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("progressbar", { name: "Enhancing" })).not.toHaveAttribute("aria-valuenow");
  },
};
