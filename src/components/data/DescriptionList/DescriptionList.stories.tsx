import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Code } from "../../ui/Code/Code";
import { CopyButton } from "../CopyButton/CopyButton";
import { StatusIndicator } from "../StatusIndicator/StatusIndicator";

import { DescriptionList } from "./DescriptionList";

const meta = {
  title: "Data/DescriptionList",
  component: DescriptionList,
  args: {
    items: [
      {
        label: "Id",
        value: (
          <span className="inline-flex items-center gap-1">
            <Code>3f9c2a1e</Code>
            <CopyButton value="3f9c2a1e" label="Copy the scan's id" />
          </span>
        ),
      },
      { label: "Status", value: <StatusIndicator tone="success">Completed</StatusIndicator> },
      { label: "Branch", value: "main" },
      { label: "Commit", value: <Code>a1b2c3d</Code> },
      { label: "Finished", value: null },
    ],
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("term")).toHaveLength(5);
    // A missing value shows a dash
    await expect(canvas.getAllByRole("definition").at(-1)).toHaveTextContent("—");
  },
};

export const Stacked: Story = {
  args: { layout: "stacked" },
};
