import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlayIcon, UploadSimpleIcon } from "@phosphor-icons/react/ssr";

import { Badge } from "../../ui/Badge/Badge";
import { Button } from "../../ui/Button/Button";
import { Code } from "../../ui/Code/Code";

import { PageHeader } from "./PageHeader";

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  args: {
    title: "backend",
    description: "The shop's API: orders, payments and customers.",
    breadcrumbs: [
      { label: "Systems", href: "/systems" },
      { label: "Shop", href: "/systems/shop" },
      { label: "backend" },
    ],
    actions: (
      <>
        <Button variant="secondary" icon={UploadSimpleIcon}>Upload results</Button>
        <Button icon={PlayIcon}>Start scan</Button>
      </>
    ),
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMeta: Story = {
  args: {
    title: "Scan of main",
    description: undefined,
    meta: (
      <>
        <Badge tone="success">Completed</Badge>
        <Code>abc1234</Code>
      </>
    ),
  },
};

export const TitleOnly: Story = {
  args: { breadcrumbs: undefined, description: undefined, actions: undefined, title: "Systems" },
};
