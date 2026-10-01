import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  args: { label: "Include test sources", name: "includeTests", onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Include test sources" });

    // Clicking the label toggles it
    await userEvent.click(canvas.getByText("Include test sources"));
    await expect(checkbox).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledOnce();

    await userEvent.keyboard(" ");
    await expect(checkbox).not.toBeChecked();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithDescription: Story = {
  args: { description: "Classes under src/test are added to the graph too." },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox")).toHaveAccessibleDescription(
      "Classes under src/test are added to the graph too.",
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const Invalid: Story = {
  args: { label: "I understand that this deletes the project", "aria-invalid": true },
};
