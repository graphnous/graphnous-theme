import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotsThreeIcon } from "@phosphor-icons/react/ssr";

import { Badge } from "../../ui/Badge/Badge";
import { Button } from "../../ui/Button/Button";
import { IconButton } from "../../ui/IconButton/IconButton";
import { Text } from "../../ui/Text/Text";

import { Card, CardBody, CardFooter, CardHeader } from "./Card";

const meta = {
  title: "Layout/Card",
  component: Card,
  args: { children: null },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader
        title="backend"
        description="https://github.com/graphnous/shop.git"
        actions={<IconButton icon={DotsThreeIcon} label="Project actions" />}
      />
      <CardBody>
        <div className="flex items-center gap-2">
          <Badge tone="success">Completed</Badge>
          <Text as="span" size="sm" tone="secondary">
            Latest scan of main, 2 minutes ago
          </Text>
        </div>
      </CardBody>
      <CardFooter>
        <Button variant="secondary" size="sm">View scans</Button>
        <Button size="sm">Start scan</Button>
      </CardFooter>
    </Card>
  ),
};

export const BodyOnly: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardBody>
        <Text>No scans yet.</Text>
      </CardBody>
    </Card>
  ),
};
