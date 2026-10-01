import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor } from "storybook/test";

import { Dialog } from "../../overlays/Dialog/Dialog";
import { Field } from "../Field/Field";

import { Combobox, type ComboboxProps } from "./Combobox";

function WithState(args: ComboboxProps) {
  const [value, setValue] = useState(args.value);

  return (
    <Combobox
      {...args}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        args.onValueChange(next);
      }}
    />
  );
}

const meta = {
  title: "Forms/Combobox",
  component: Combobox,
  args: {
    value: null,
    onValueChange: fn(),
    placeholder: "Choose a project",
    options: [
      { value: "graphnous", label: "Graphnous", description: "github.com/graphnous/graphnous" },
      { value: "graphnous-ui", label: "Graphnous UI", description: "github.com/graphnous/graphnous-ui" },
      { value: "petclinic", label: "Pet Clinic", description: "github.com/spring-projects/spring-petclinic" },
      { value: "shop", label: "Shop", description: "gitlab.com/acme/shop" },
    ],
  },
  render: (args) => (
    <div className="max-w-sm">
      <Field label="Project">
        <WithState {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: "petclinic" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Project" })).toHaveValue("Pet Clinic");
  },
};

export const Filtered: Story = {
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Project" });

    await userEvent.type(input, "graph");
    const listbox = screen.getByRole("listbox", { name: "Project" });
    await expect(listbox).toBeVisible();
    await expect(screen.getAllByRole("option")).toHaveLength(2);

    await userEvent.click(screen.getByRole("option", { name: /Graphnous UI/ }));
    await expect(args.onValueChange).toHaveBeenCalledWith("graphnous-ui");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    await expect(input).toHaveValue("Graphnous UI");
  },
};

export const ChosenWithTheKeyboard: Story = {
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Project" });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");
    await expect(input).toHaveAttribute("aria-expanded", "true");

    // Focus stays in the input; the active option is pointed to
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await expect(input).toHaveFocus();
    const active = document.getElementById(input.getAttribute("aria-activedescendant")!);
    await expect(active).toHaveTextContent("Pet Clinic");

    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenCalledWith("petclinic");
    await expect(input).toHaveValue("Pet Clinic");
  },
};

export const NothingMatches: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByRole("combobox", { name: "Project" }), "kotlin");

    await expect(screen.getByRole("option", { name: "No matches" })).toHaveAttribute("aria-disabled", "true");

    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const ClosedWithEscape: Story = {
  args: { value: "shop" },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Project" });

    await userEvent.click(input);
    await userEvent.keyboard("pet");
    await expect(screen.getByRole("listbox")).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    // What was typed is dropped; the choice stays
    await expect(input).toHaveValue("Shop");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

/**
 * In a dialog, Escape closes the list first and the dialog second.
 */
export const InADialog: Story = {
  render: (args) => (
    <Dialog open onClose={fn()} title="Scan a project">
      <Field label="Project">
        <WithState {...args} />
      </Field>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Project" });

    await userEvent.click(input);
    const listbox = screen.getByRole("listbox", { name: "Project" });
    // Inside the dialog, as the page behind it is inert
    await expect(canvas.getByRole("dialog")).toContainElement(listbox);

    await userEvent.click(screen.getByRole("option", { name: /Shop/ }));
    await expect(input).toHaveValue("Shop");

    await userEvent.click(input);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    await expect(canvas.getByRole("dialog")).toBeVisible();
  },
};
