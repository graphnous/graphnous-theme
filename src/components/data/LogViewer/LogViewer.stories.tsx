import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";

import { Button } from "../../ui/Button/Button";

import { LogViewer, type LogLevel, type LogLine, type LogViewerProps } from "./LogViewer";

const messages: Array<[LogLevel, string]> = [
  ["INFO", "Checking out github.com/graphnous/graphnous at main"],
  ["DEBUG", "Resolved 142 dependencies"],
  ["INFO", "Scanning graphnous-server/src/main/java"],
  ["TRACE", "Visiting dev.graphnous.api.ScanController"],
  ["WARN", "Skipping generated sources in target/generated-sources"],
  ["ERROR", "Could not parse graphnous-server/src/main/java/dev/graphnous/Broken.java: unexpected token at 12:4"],
];

const line = (index: number): LogLine => {
  const [level, message] = messages[index % messages.length];
  return { timestamp: new Date(Date.UTC(2026, 8, 30, 18, 41, 0, index * 137)).toISOString(), level, message };
};

const lines = (count: number) => Array.from({ length: count }, (_, index) => line(index));

/**
 * Adds a line with the button, as a running scan would.
 */
function Streaming(args: LogViewerProps) {
  const [current, setCurrent] = useState(args.lines);

  return (
    <div className="flex flex-col gap-2">
      <Button size="sm" variant="secondary" onClick={() => setCurrent((all) => [...all, line(all.length)])} className="self-start">
        Add a line
      </Button>
      <LogViewer {...args} lines={current} />
    </div>
  );
}

const meta = {
  title: "Data/LogViewer",
  component: LogViewer,
  args: { label: "Scan logs", lines: lines(40), height: "16rem" },
  render: (args) => <Streaming {...args} />,
} satisfies Meta<typeof LogViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Long: Story = {
  // Outside the args, which Storybook copies and shows in its controls
  render: (args) => <Streaming {...args} lines={lines(100_000)} />,
  play: async ({ canvas }) => {
    const log = canvas.getByRole("region", { name: "Scan logs" });

    // Only the lines in view, and a few around them, are in the page
    await expect(canvas.getAllByRole("listitem").length).toBeLessThan(100);
    // It starts at the end
    await waitFor(() => expect(canvas.getByText("100000")).toBeVisible());
    await expect(log.querySelector("[aria-posinset='100000']")).toHaveAttribute("aria-setsize", "100000");
  },
};

export const FollowsNewLines: Story = {
  play: async ({ canvas }) => {
    const log = canvas.getByRole("region", { name: "Scan logs" });

    await userEvent.click(canvas.getByRole("button", { name: "Add a line" }));
    await waitFor(() => expect(canvas.getByText("41")).toBeVisible());
    await expect(log.scrollTop + log.clientHeight).toBeGreaterThanOrEqual(log.scrollHeight - 1);
  },
};

export const StopsFollowingWhenScrolledUp: Story = {
  play: async ({ canvas }) => {
    const log = canvas.getByRole("region", { name: "Scan logs" });

    log.scrollTop = 0;
    await waitFor(() => expect(canvas.getByRole("button", { name: "Follow new lines" })).toBeVisible());

    await userEvent.click(canvas.getByRole("button", { name: "Add a line" }));
    await expect(log.scrollTop).toBe(0);

    await userEvent.click(canvas.getByRole("button", { name: "Follow new lines" }));
    await waitFor(() => expect(canvas.getByText("41")).toBeVisible());
    await expect(canvas.queryByRole("button", { name: "Follow new lines" })).toBeNull();
  },
};

export const Empty: Story = {
  args: { lines: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No logs yet")).toBeVisible();
  },
};
