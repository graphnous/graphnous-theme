import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardBody } from "../../layout/Card/Card";
import { VisuallyHidden } from "../../ui/VisuallyHidden/VisuallyHidden";

import { Skeleton } from "./Skeleton";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { lines: 3 },
  render: (args) => (
    <div className="max-w-sm">
      <Skeleton {...args} />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex max-w-sm items-center gap-4">
      <Skeleton shape="circle" />
      <Skeleton shape="block" className="h-16" />
    </div>
  ),
};

/**
 * A card that is loading: the region is busy and says what loads, for
 * screen readers; the skeletons are hidden from them.
 */
export const LoadingCard: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardBody>
        <div aria-busy="true" className="flex flex-col gap-4">
          <VisuallyHidden>Loading the latest scan</VisuallyHidden>
          <div className="flex items-center gap-3">
            <Skeleton shape="circle" className="size-8" />
            <Skeleton className="w-40" />
          </div>
          <Skeleton lines={2} />
        </div>
      </CardBody>
    </Card>
  ),
};
