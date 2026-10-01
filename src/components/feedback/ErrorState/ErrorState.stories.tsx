import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

import { ErrorState } from "./ErrorState";

const meta = {
  title: "Feedback/ErrorState",
  component: ErrorState,
  args: {
    title: "The scans could not be loaded",
    description: "The server did not answer. Check your connection and try again.",
    onRetry: fn(),
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("The scans could not be loaded");
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};

export const Retrying: Story = {
  args: { retrying: true },
};

export const WithoutRetry: Story = {
  args: { title: undefined, description: "Scan not found.", onRetry: undefined },
};
