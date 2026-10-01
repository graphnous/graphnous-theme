import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Code } from "../../ui/Code/Code";
import { Duration } from "../Duration/Duration";

import { Timeline } from "./Timeline";

const at = (seconds: number) => new Date(Date.UTC(2026, 8, 30, 18, 41, seconds)).toISOString();

const meta = {
  title: "Data/Timeline",
  component: Timeline,
  args: {
    label: "Scan steps",
    steps: [
      { id: "checkout", title: "Check out", status: "completed", meta: <Duration start={at(0)} end={at(4)} /> },
      { id: "plan", title: "Plan", status: "completed", meta: <Duration start={at(4)} end={at(5)} /> },
      { id: "scan", title: "Scan", status: "running", meta: <Duration start={at(5)} end={null} /> },
      { id: "store", title: "Store", status: "pending" },
      { id: "enhance-results", title: "Enhance results", status: "pending" },
      { id: "enhance-scan", title: "Enhance scan", status: "pending" },
    ],
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  play: async ({ canvas }) => {
    const steps = canvas.getAllByRole("listitem");

    await expect(canvas.getByRole("list", { name: "Scan steps" })).toBeInTheDocument();
    await expect(steps).toHaveLength(6);
    await expect(steps[2]).toHaveAttribute("aria-current", "step");
    // The state is said, not only shown
    await expect(steps[0]).toHaveTextContent("Check out: Completed");
  },
};

export const Failed: Story = {
  args: {
    steps: [
      { id: "checkout", title: "Check out", status: "completed", meta: <Duration start={at(0)} end={at(4)} /> },
      { id: "plan", title: "Plan", status: "completed", meta: <Duration start={at(4)} end={at(5)} /> },
      {
        id: "scan",
        title: "Scan",
        status: "failed",
        meta: <Duration start={at(5)} end={at(38)} />,
        children: (
          <>
            The scanner exited with code 1: <Code>Could not resolve dependencies</Code>
          </>
        ),
      },
      { id: "store", title: "Store", status: "skipped" },
      { id: "enhance-results", title: "Enhance results", status: "skipped" },
      { id: "enhance-scan", title: "Enhance scan", status: "skipped" },
    ],
  },
};

export const Uploaded: Story = {
  args: {
    steps: [
      { id: "checkout", title: "Check out", status: "skipped" },
      { id: "plan", title: "Plan", status: "skipped" },
      { id: "scan", title: "Scan", status: "skipped" },
      { id: "store", title: "Store", status: "completed", meta: <Duration start={at(0)} end={at(2)} /> },
      { id: "enhance-results", title: "Enhance results", status: "completed", meta: <Duration start={at(2)} end={at(9)} /> },
      { id: "enhance-scan", title: "Enhance scan", status: "completed", meta: <Duration start={at(9)} end={at(11)} /> },
    ],
  },
};
