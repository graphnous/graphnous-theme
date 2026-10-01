import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor } from "storybook/test";

import { Timestamp } from "./Timestamp";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

const meta = {
  title: "Data/Timestamp",
  component: Timestamp,
  args: { value: minutesAgo(5) },
  render: (args) => (
    <div className="flex h-24 items-end text-sm">
      <Timestamp {...args} />
    </div>
  ),
} satisfies Meta<typeof Timestamp>;

export default meta;
type Story = StoryObj<typeof meta>;

// Over a week ago whenever the story runs, so it shows the date
const long = new Date(2024, 8, 30, 18, 41, 7);

export const Default: Story = {
  args: { value: long },
  play: async ({ canvas }) => {
    const time = canvas.getByText(/30 Sept 2024/);
    await expect(time).toHaveAttribute("dateTime", long.toISOString());

    // The exact time on focus
    await userEvent.tab();
    await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent("30 September 2024 at 18:41:07"));
  },
};

export const MinutesAgo: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("5 minutes ago")).toBeVisible();
  },
};

export const FromTheApi: Story = {
  args: { value: minutesAgo(60 * 26).toISOString() },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("yesterday")).toBeVisible();
  },
};

export const Missing: Story = {
  args: { value: null },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("time")).toBeNull();
  },
};
