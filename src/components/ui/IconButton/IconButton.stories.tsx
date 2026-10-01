import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyIcon, DotsThreeIcon, TrashIcon } from "@phosphor-icons/react/ssr";
import { expect } from "storybook/test";

import { IconButton } from "./IconButton";

const meta = {
  title: "Primitives/IconButton",
  component: IconButton,
  args: { icon: DotsThreeIcon, label: "More actions" },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    // The label is the button's accessible name
    await expect(canvas.getByRole("button", { name: "More actions" })).toBeVisible();
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-3">
      <IconButton icon={CopyIcon} label="Copy id" variant="ghost" />
      <IconButton icon={CopyIcon} label="Copy id" variant="secondary" />
      <IconButton icon={CopyIcon} label="Copy id" variant="primary" />
      <IconButton icon={TrashIcon} label="Delete scan" variant="danger" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} size="sm" variant="secondary" />
      <IconButton {...args} size="md" variant="secondary" />
      <IconButton {...args} size="lg" variant="secondary" />
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, variant: "secondary" },
};
