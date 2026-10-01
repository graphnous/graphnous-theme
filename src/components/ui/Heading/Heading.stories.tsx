import type { Meta, StoryObj } from "@storybook/react-vite";

import { Heading } from "./Heading";

const meta = {
  title: "Primitives/Heading",
  component: Heading,
  args: { level: 1, children: "Shop" },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Levels: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Heading level={1}>System: Shop</Heading>
      <Heading level={2}>Projects</Heading>
      <Heading level={3}>backend</Heading>
      <Heading level={4}>Latest scan</Heading>
    </div>
  ),
};

/**
 * A level for the outline, a size for the look.
 */
export const LevelAndSizeApart: Story = {
  args: { level: 2, size: "sm", children: "Steps" },
};
