import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text } from "./Text";

const meta = {
  title: "Primitives/Text",
  component: Text,
  args: { children: "Scanned 1 module, 4 files, 4 classes" },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <Text key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} tone="default" />
      <Text {...args} tone="secondary" />
      <Text {...args} tone="muted" />
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} weight="normal" />
      <Text {...args} weight="medium" />
      <Text {...args} weight="semibold" />
    </div>
  ),
};

export const Truncated: Story = {
  args: {
    truncate: true,
    className: "max-w-xs",
    children: "com.example.restservice.GreetingController.greeting(java.lang.String)",
  },
};
