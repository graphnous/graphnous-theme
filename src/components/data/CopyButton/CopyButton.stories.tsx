import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, spyOn, userEvent, waitFor } from "storybook/test";

import { Code } from "../../ui/Code/Code";

import { CopyButton } from "./CopyButton";

const meta = {
  title: "Data/CopyButton",
  component: CopyButton,
  args: { value: "3f9c2a1e-7b4d-4c1a-9e0f-2d8b6a5c4e3f", label: "Copy the scan's id" },
  render: (args) => (
    <span className="inline-flex items-center gap-1 text-sm">
      <Code>{args.value}</Code>
      <CopyButton {...args} />
    </span>
  ),
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Copied: Story = {
  play: async ({ args, canvas }) => {
    const writeText = spyOn(navigator.clipboard, "writeText").mockResolvedValue();

    await userEvent.click(canvas.getByRole("button", { name: "Copy the scan's id" }));

    await expect(writeText).toHaveBeenCalledWith(args.value);
    await expect(canvas.getByRole("status")).toHaveTextContent("Copied");
    // And back after a moment
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent(""), { timeout: 3000 });
  },
};

export const Failed: Story = {
  play: async ({ canvas }) => {
    spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("Not allowed"));

    await userEvent.click(canvas.getByRole("button", { name: "Copy the scan's id" }));

    await expect(canvas.getByRole("status")).toHaveTextContent("Could not copy");
  },
};
