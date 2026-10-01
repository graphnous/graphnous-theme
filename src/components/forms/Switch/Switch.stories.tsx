import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

import { Switch } from "./Switch";

const meta = {
  title: "Forms/Switch",
  component: Switch,
  args: { label: "Spring enhancer", name: "spring", onChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas }) => {
    const toggle = canvas.getByRole("switch", { name: "Spring enhancer" });

    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledOnce();

    await userEvent.keyboard(" ");
    await expect(toggle).not.toBeChecked();
  },
};

export const On: Story = {
  args: { defaultChecked: true },
};

export const WithDescription: Story = {
  args: { description: "Adds endpoints and beans to the graph." },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("switch")).toHaveAccessibleDescription("Adds endpoints and beans to the graph.");
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};
