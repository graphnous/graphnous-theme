import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { VisuallyHidden } from "./VisuallyHidden";

const meta = {
  title: "Primitives/VisuallyHidden",
  component: VisuallyHidden,
  args: { children: "Status:" },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Only screen readers hear "Status:" before the badge text.
 */
export const Default: Story = {
  render: (args) => (
    <p>
      <VisuallyHidden {...args} /> Completed
    </p>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Status:")).toHaveClass("sr-only");
  },
};
