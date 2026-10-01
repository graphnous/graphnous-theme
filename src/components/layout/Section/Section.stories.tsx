import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlayIcon } from "@phosphor-icons/react/ssr";
import { expect } from "storybook/test";

import { Button } from "../../ui/Button/Button";
import { Text } from "../../ui/Text/Text";

import { Section } from "./Section";

const meta = {
  title: "Layout/Section",
  component: Section,
  args: {
    title: "Scans",
    description: "Every scan of this project, newest first.",
    actions: <Button size="sm" icon={PlayIcon}>Start scan</Button>,
    children: <Text tone="secondary">The scan table goes here.</Text>,
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    // Named by its title, so screen readers can jump to it
    await expect(canvas.getByRole("region", { name: "Scans" })).toBeVisible();
  },
};

export const TitleOnly: Story = {
  args: { description: undefined, actions: undefined },
};
