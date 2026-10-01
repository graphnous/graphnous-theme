import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

import { Field } from "../Field/Field";

import { Select } from "./Select";

const meta = {
  title: "Forms/Select",
  component: Select,
  args: {
    name: "language",
    placeholder: "Choose a language",
    onChange: fn(),
    options: [
      { value: "java", label: "Java" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python", disabled: true },
    ],
  },
  render: (args) => (
    <div className="max-w-sm">
      <Field label="Language">
        <Select {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas }) => {
    const select = canvas.getByRole("combobox", { name: "Language" });
    await expect(select).toHaveValue("");

    await userEvent.selectOptions(select, "TypeScript");
    await expect(select).toHaveValue("typescript");
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
};

export const WithValue: Story = {
  args: { defaultValue: "java" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Language" })).toHaveValue("java");
  },
};

export const Invalid: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Field label="Language" error="Choose the language of the repository.">
        <Select {...args} />
      </Field>
    </div>
  ),
};
