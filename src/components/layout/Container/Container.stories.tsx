import type { Meta, StoryObj } from "@storybook/react-vite";

import { Container } from "./Container";

const meta = {
  title: "Layout/Container",
  component: Container,
  args: { children: null },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["md", "lg", "xl"] as const).map((size) => (
        <Container key={size} size={size}>
          <div className="rounded-control bg-surface-elevated px-3 py-2 text-sm">{size}</div>
        </Container>
      ))}
    </div>
  ),
};
