import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, MinusIcon, XIcon } from "@phosphor-icons/react/ssr";

import { StatusIndicator } from "./StatusIndicator";

const meta = {
  title: "Data/StatusIndicator",
  component: StatusIndicator,
  args: { tone: "success", children: "Completed" },
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { tone: "info", children: "Running", active: true },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusIndicator tone="neutral">Pending</StatusIndicator>
      <StatusIndicator tone="info" active>
        Running
      </StatusIndicator>
      <StatusIndicator tone="success">Completed</StatusIndicator>
      <StatusIndicator tone="error">Failed</StatusIndicator>
      <StatusIndicator tone="warning">Cancelled</StatusIndicator>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusIndicator tone="success" icon={CheckIcon}>
        Completed
      </StatusIndicator>
      <StatusIndicator tone="error" icon={XIcon}>
        Failed
      </StatusIndicator>
      <StatusIndicator tone="neutral" icon={MinusIcon}>
        Skipped
      </StatusIndicator>
    </div>
  ),
};
