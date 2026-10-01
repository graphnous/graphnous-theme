import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  args: {
    label: "Source",
    name: "source",
    defaultValue: "repository",
    onValueChange: fn(),
    options: [
      { value: "repository", label: "Repository", description: "Checked out and scanned by Graphnous." },
      { value: "upload", label: "Upload", description: "Results scanned elsewhere, such as in CI." },
      { value: "schedule", label: "Schedule", disabled: true },
    ],
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("group", { name: "Source" })).toBeInTheDocument();
    const repository = canvas.getByRole("radio", { name: "Repository" });
    await expect(repository).toBeChecked();
    await expect(repository).toHaveAccessibleDescription("Checked out and scanned by Graphnous.");

    // The arrow keys move between them, skipping disabled ones
    await userEvent.tab();
    await expect(repository).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "Upload" })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith("upload");
  },
};

export const Controlled: Story = {
  args: { value: "upload", defaultValue: undefined },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Repository" }));

    // The parent decides; it did not change the value here
    await expect(args.onValueChange).toHaveBeenCalledWith("repository");
    await expect(canvas.getByRole("radio", { name: "Upload" })).toBeChecked();
  },
};

export const Invalid: Story = {
  args: { defaultValue: undefined, required: true, error: "Choose where the scan comes from." },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("group", { name: "Source" })).toHaveAccessibleDescription(
      "Choose where the scan comes from.",
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
