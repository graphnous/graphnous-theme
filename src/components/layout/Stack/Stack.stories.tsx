import type { Meta, StoryObj } from "@storybook/react-vite";

import { Inline, Stack } from "./Stack";

function Box({ children }: { children: string }) {
  return <div className="rounded-control bg-surface-elevated px-3 py-2 text-sm">{children}</div>;
}

const meta = {
  title: "Layout/Stack",
  component: Stack,
  args: { children: null },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <Stack gap={3} className="max-w-xs">
      <Box>Checkout</Box>
      <Box>Plan</Box>
      <Box>Scan</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Inline gap={2}>
      <Box>main</Box>
      <Box>abc1234</Box>
      <Box>2 targets</Box>
    </Inline>
  ),
};

export const SpacedApart: Story = {
  render: () => (
    <Inline justify="between" className="max-w-md">
      <Box>Scans</Box>
      <Box>Start scan</Box>
    </Inline>
  ),
};

export const Wrapping: Story = {
  render: () => (
    <Inline gap={2} wrap className="max-w-xs">
      {["ScanTarget", "Module", "File", "Package", "Class", "Method", "Field", "Annotation"].map((kind) => (
        <Box key={kind}>{kind}</Box>
      ))}
    </Inline>
  ),
};
