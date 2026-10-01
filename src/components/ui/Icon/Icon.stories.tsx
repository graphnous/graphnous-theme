import type { Meta, StoryObj } from "@storybook/react-vite";
import { GitBranchIcon, GraphIcon, WarningIcon } from "@phosphor-icons/react/ssr";

import { Icon } from "./Icon";

const meta = {
  title: "Primitives/Icon",
  component: Icon,
  args: { icon: GraphIcon },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Icon key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div className="flex gap-4">
      {(["thin", "light", "regular", "bold", "fill", "duotone"] as const).map((weight) => (
        <Icon key={weight} {...args} size="lg" weight={weight} />
      ))}
    </div>
  ),
};

/**
 * Icons take the colour of their text.
 */
export const InText: Story = {
  render: () => (
    <p className="flex items-center gap-2 text-warning-soft-foreground">
      <Icon icon={WarningIcon} size="sm" />
      Scan finished with warnings on
      <Icon icon={GitBranchIcon} size="sm" label="branch" />
      main
    </p>
  ),
};
