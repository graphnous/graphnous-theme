import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

import { Field } from "../Field/Field";

import { TextArea } from "./TextArea";

const meta = {
  title: "Forms/TextArea",
  component: TextArea,
  args: { placeholder: "What the project is about" },
  render: (args) => (
    <div className="max-w-sm">
      <Field label="Description" description="Optional.">
        <TextArea {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole("textbox", { name: "Description" });

    await userEvent.type(textarea, "Scans the Graphnous code.{Enter}Twice a day.");
    await expect(textarea).toHaveValue("Scans the Graphnous code.\nTwice a day.");
  },
};

export const Invalid: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Field label="Description" error="At most 500 characters.">
        <TextArea {...args} defaultValue={"Too long. ".repeat(20)} />
      </Field>
    </div>
  ),
};
