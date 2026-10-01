import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";

import { Field } from "../Field/Field";

import { SearchInput } from "./SearchInput";

const meta = {
  title: "Forms/SearchInput",
  component: SearchInput,
  args: { label: "Search projects", placeholder: "Search projects", onSearch: fn() },
  render: (args) => (
    <div className="max-w-sm">
      <SearchInput {...args} />
    </div>
  ),
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Debounced: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByRole("searchbox", { name: "Search projects" }), "graph");

    // Once typing pauses, not once per letter
    await waitFor(() => expect(args.onSearch).toHaveBeenCalledWith("graph"));
    await expect(args.onSearch).toHaveBeenCalledOnce();
  },
};

export const Cleared: Story = {
  args: { defaultValue: "petclinic" },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("searchbox", { name: "Search projects" });

    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    await expect(input).toHaveValue("");
    await expect(input).toHaveFocus();
    await expect(args.onSearch).toHaveBeenCalledWith("");
    await expect(canvas.queryByRole("button", { name: "Clear search" })).toBeNull();
  },
};

export const ClearedWithEscape: Story = {
  args: { defaultValue: "petclinic" },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("searchbox", { name: "Search projects" });

    await userEvent.click(input);
    await userEvent.keyboard("{Escape}");
    await expect(input).toHaveValue("");
    await expect(args.onSearch).toHaveBeenCalledWith("");
  },
};

export const InAField: Story = {
  args: { label: undefined },
  render: (args) => (
    <div className="max-w-sm">
      <Field label="Filter classes" description="By name or package.">
        <SearchInput {...args} placeholder="ScanController" />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("searchbox", { name: "Filter classes" })).toHaveAccessibleDescription(
      "By name or package.",
    );
  },
};
