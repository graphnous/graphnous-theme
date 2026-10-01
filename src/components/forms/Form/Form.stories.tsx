import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";

import { Button } from "../../ui/Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Field } from "../Field/Field";
import { TextArea } from "../TextArea/TextArea";
import { TextInput } from "../TextInput/TextInput";

import { Form, SubmitButton, type FormProps } from "./Form";

const nameError = "A project with this name already exists.";

/**
 * Creating a project, with an API that is slow and knows one name already.
 */
function CreateProject(args: FormProps) {
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<string>();

  return (
    <Form
      {...args}
      error={error ?? args.error}
      className="max-w-md"
      onSubmit={async (data, event) => {
        setError(undefined);
        setFieldError(undefined);
        await args.onSubmit(data, event);
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (data.get("name") === "graphnous") {
          setFieldError(nameError);
        } else if (data.get("name") === "offline") {
          setError("The server could not be reached. Try again.");
        }
      }}
    >
      <Field label="Name" required error={fieldError}>
        <TextInput name="name" />
      </Field>
      <Field label="Description">
        <TextArea name="description" rows={3} />
      </Field>
      <Checkbox name="scanNow" label="Scan it right away" defaultChecked />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" type="reset">
          Reset
        </Button>
        <SubmitButton>Create project</SubmitButton>
      </div>
    </Form>
  );
}

const meta = {
  title: "Forms/Form",
  component: Form,
  args: { onSubmit: fn(), children: null },
  render: (args) => <CreateProject {...args} />,
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Submitted: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Pet Clinic");
    await userEvent.click(canvas.getByRole("button", { name: "Create project" }));

    // A spinner while it submits
    await expect(canvas.getByRole("button", { name: /Create project/ })).toBeDisabled();
    await waitFor(() => expect(canvas.getByRole("button", { name: "Create project" })).toBeEnabled());

    await expect(args.onSubmit).toHaveBeenCalledOnce();
    const data = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0] as FormData;
    await expect(Object.fromEntries(data)).toEqual({ name: "Pet Clinic", description: "", scanNow: "on" });
  },
};

export const RequiredFieldsFirst: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Create project" }));

    // The browser stops it and points to the empty field
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(canvas.getByRole("textbox", { name: "Name" })).toHaveFocus();
  },
};

export const ErrorOnAField: Story = {
  play: async ({ canvas }) => {
    const name = canvas.getByRole("textbox", { name: "Name" });

    await userEvent.type(name, "graphnous{Enter}");

    await waitFor(() => expect(name).toBeInvalid());
    await expect(name).toHaveAccessibleDescription(nameError);
  },
};

export const ErrorOnTheForm: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "offline{Enter}");

    await expect(await canvas.findByRole("alert")).toHaveTextContent("The server could not be reached. Try again.");
  },
};

export const WithAnError: Story = {
  args: { error: "You do not have permission to create projects in this organization." },
};
