import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRightIcon, PlayIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react/ssr";
import { expect, fn, userEvent } from "storybook/test";

import { Button } from "./Button";
import { ButtonLink } from "./ButtonLink";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Start scan", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { icon: PlayIcon },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Button {...args} variant="primary" icon={PlusIcon}>New project</Button>
      <Button {...args} variant="secondary">Cancel</Button>
      <Button {...args} variant="ghost">Show logs</Button>
      <Button {...args} variant="danger" icon={TrashIcon}>Delete scan</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const WithIconAfter: Story = {
  args: { children: "Next", variant: "secondary", iconEnd: ArrowRightIcon },
};

export const Loading: Story = {
  args: { loading: true, children: "Starting scan" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: /starting scan/i });

    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Clicked: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Start scan" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

/**
 * ButtonLink: a link that looks like a button, for actions that open a page.
 */
export const AsLink: Story = {
  render: () => (
    <ButtonLink href="/projects/new" icon={PlusIcon}>
      New project
    </ButtonLink>
  ),
};
