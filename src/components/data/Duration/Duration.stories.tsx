import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Duration } from "./Duration";

const start = "2026-09-30T18:41:07Z";

const meta = {
  title: "Data/Duration",
  component: Duration,
  args: { start, end: "2026-09-30T18:43:20Z" },
  render: (args) => (
    <p className="text-sm">
      <Duration {...args} />
    </p>
  ),
} satisfies Meta<typeof Duration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("2 min 13 s")).toBeVisible();
  },
};

export const Hours: Story = {
  args: { end: "2026-09-30T19:46:07Z" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("1 h 5 min")).toBeVisible();
  },
};

export const UnderASecond: Story = {
  args: { end: "2026-09-30T18:41:07.400Z" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("< 1 s")).toBeVisible();
  },
};

export const StillRunning: Story = {
  args: { end: null },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Still running")).toBeVisible();
  },
};

export const NotStarted: Story = {
  args: { start: null, end: null },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("p")).toBeEmptyDOMElement();
  },
};
