import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "./Divider";

const meta = {
  title: "Primitives/Divider",
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <p>Checkout</p>
      <Divider />
      <p>Plan</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-3">
      <span>main</span>
      <Divider orientation="vertical" />
      <span>abc1234</span>
    </div>
  ),
};
