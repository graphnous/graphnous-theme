import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, CircleNotchIcon, WarningIcon, XIcon } from "@phosphor-icons/react/ssr";

import { Badge } from "./Badge";

const tones = ["neutral", "info", "success", "warning", "error"] as const;

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  args: { children: "Completed", tone: "success" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Soft: Story = {
  render: () => (
    <div className="flex gap-2">
      {tones.map((tone) => (
        <Badge key={tone} tone={tone}>{tone}</Badge>
      ))}
    </div>
  ),
};

export const Solid: Story = {
  render: () => (
    <div className="flex gap-2">
      {tones.map((tone) => (
        <Badge key={tone} tone={tone} variant="solid">{tone}</Badge>
      ))}
    </div>
  ),
};

/**
 * How statuses will use it, such as a scan's.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge tone="neutral">Pending</Badge>
      <Badge tone="info" icon={CircleNotchIcon}>Running</Badge>
      <Badge tone="success" icon={CheckIcon}>Completed</Badge>
      <Badge tone="warning" icon={WarningIcon}>Warnings</Badge>
      <Badge tone="error" icon={XIcon}>Failed</Badge>
    </div>
  ),
};
