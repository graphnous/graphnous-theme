import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

import { TextInput } from "../TextInput/TextInput";

import { Field } from "./Field";

const meta = {
  title: "Forms/Field",
  component: Field,
  args: {
    label: "Name",
    children: <TextInput name="name" defaultValue="graphnous" />,
  },
  render: (args) => (
    <div className="max-w-sm">
      <Field {...args} />
    </div>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Name" });

    // Clicking the label focuses the input
    await userEvent.click(canvas.getByText("Name"));
    await expect(input).toHaveFocus();
    await expect(input).not.toHaveAttribute("aria-describedby");
  },
};

export const WithDescription: Story = {
  args: { description: "Shown in the projects list." },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Name" })).toHaveAccessibleDescription(
      "Shown in the projects list.",
    );
  },
};

export const WithError: Story = {
  args: {
    description: "Shown in the projects list.",
    error: "A project with this name already exists.",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Name" });

    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription(
      "Shown in the projects list. A project with this name already exists.",
    );
  },
};

export const Required: Story = {
  args: { required: true },
  play: async ({ canvas }) => {
    // The asterisk is for the eye; screen readers hear "required"
    await expect(canvas.getByRole("textbox", { name: "Name" })).toBeRequired();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Name" })).toBeDisabled();
  },
};

export const HiddenLabel: Story = {
  args: { hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  },
};
