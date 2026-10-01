import type { Meta, StoryObj } from "@storybook/react-vite";
import { GitBranchIcon, LinkIcon } from "@phosphor-icons/react/ssr";
import { expect, userEvent } from "storybook/test";

import { Field } from "../Field/Field";

import { TextInput } from "./TextInput";

const meta = {
  title: "Forms/TextInput",
  component: TextInput,
  args: { placeholder: "https://github.com/graphnous/graphnous.git" },
  render: (args) => (
    <div className="max-w-sm">
      <Field label="Repository URL">
        <TextInput {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Repository URL" });

    await userEvent.type(input, "https://github.com/graphnous/graphnous.git");
    await expect(input).toHaveValue("https://github.com/graphnous/graphnous.git");
  },
};

export const WithIcon: Story = {
  args: { icon: LinkIcon, type: "url" },
};

export const WithValue: Story = {
  args: { icon: GitBranchIcon, defaultValue: "main", placeholder: undefined },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "https://github.com/graphnous/graphnous.git" },
};
