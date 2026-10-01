import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

import { Button } from "../../ui/Button/Button";

import { Alert } from "./Alert";

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  args: {
    tone: "warning",
    title: "This scan is still running",
    children: "A scan can be deleted once it has completed or failed.",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-3">
      <Alert tone="neutral" title="No enhancers are installed">Scans store their results without enhancing them.</Alert>
      <Alert tone="info" title="Results are uploaded">Storing and enhancing them continue in the background.</Alert>
      <Alert tone="success" title="Scan completed">1 target, 4 classes.</Alert>
      <Alert tone="warning" title="1 of 2 targets could not be scanned">The results of the other target are stored.</Alert>
      <Alert tone="error" title="The checkout failed">Repository not found.</Alert>
    </div>
  ),
};

export const WithAction: Story = {
  args: {
    tone: "error",
    title: "Your plan does not allow more projects",
    children: "Remove a project, or upgrade to add more.",
    action: <Button size="sm" variant="secondary">See plans</Button>,
  },
};

export const Dismissible: Story = {
  args: { tone: "info", title: "Scans now record their steps", children: undefined, onDismiss: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(args.onDismiss).toHaveBeenCalledOnce();
  },
};

/**
 * Appearing after something the user did: announced to screen readers.
 */
export const Announced: Story = {
  args: { tone: "error", announce: true, title: "The upload was refused", children: "More than one scan result is for target backend." },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("The upload was refused");
  },
};
