import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

import { Field } from "../Field/Field";

import { FileDrop, type FileDropProps } from "./FileDrop";

function WithState(args: FileDropProps) {
  const [files, setFiles] = useState(args.files);

  return (
    <FileDrop
      {...args}
      files={files}
      onFilesChange={(next) => {
        setFiles(next);
        args.onFilesChange(next);
      }}
    />
  );
}

const result = (name: string, bytes = 1400) =>
  new File(["x".repeat(bytes)], name, { type: "application/json", lastModified: 1 });

const meta = {
  title: "Forms/FileDrop",
  component: FileDrop,
  args: {
    files: [],
    onFilesChange: fn(),
    accept: ".json",
    prompt: "Drop scan result files here",
  },
  render: (args) => (
    <div className="max-w-md">
      <Field label="Scan results" description="The JSON files a scanner wrote.">
        <WithState {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof FileDrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFiles: Story = {
  args: { files: [result("graphnous-server.json", 1_430_000), result("graphnous-ui.json", 212_000)] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("1.4 MB")).toBeVisible();
    await expect(canvas.getByText("212 kB")).toBeVisible();
  },
};

export const Picked: Story = {
  play: async ({ args, canvas, canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;

    await userEvent.upload(input, [result("server.json"), result("ui.json")]);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(2);
    await expect(args.onFilesChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: "server.json" }),
      expect.objectContaining({ name: "ui.json" }),
    ]);

    // The same file again is not added twice
    await userEvent.upload(input, [result("server.json")]);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(2);
  },
};

export const Dropped: Story = {
  play: async ({ canvas }) => {
    const zone = canvas.getByText(/Drop scan result files here/).parentElement!;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(result("server.json"));
    dataTransfer.items.add(new File(["x"], "notes.txt"));
    zone.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }));

    await expect(await canvas.findByRole("listitem")).toHaveTextContent("server.json");
    await expect(canvas.getByRole("status")).toHaveTextContent("Not added, as only .json files are allowed: notes.txt");
  },
};

export const Removed: Story = {
  args: { files: [result("server.json"), result("ui.json")] },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Remove server.json" }));

    await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
    await expect(args.onFilesChange).toHaveBeenCalledWith([expect.objectContaining({ name: "ui.json" })]);
  },
};

export const OneFile: Story = {
  args: { multiple: false, prompt: "Drop a scan result file here" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Choose a file" })).toHaveAccessibleDescription(
      "The JSON files a scanner wrote.",
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Field label="Scan results" disabled>
        <WithState {...args} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Choose files" })).toBeDisabled();
  },
};
