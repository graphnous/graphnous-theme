import type { Meta, StoryObj } from "@storybook/react-vite";
import { GraphIcon, ListChecksIcon, TerminalIcon } from "@phosphor-icons/react/ssr";
import { expect, fn, userEvent } from "storybook/test";

import { Text } from "../../ui/Text/Text";

import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

const meta = {
  title: "Layout/Tabs",
  component: Tabs,
  args: { defaultValue: "steps", onValueChange: fn(), children: null },
  render: (args) => (
    <Tabs {...args}>
      <TabList label="Scan">
        <Tab value="steps" icon={ListChecksIcon}>Steps</Tab>
        <Tab value="logs" icon={TerminalIcon}>Logs</Tab>
        <Tab value="results" icon={GraphIcon} disabled>Results</Tab>
        <Tab value="enhancers">Enhancers</Tab>
      </TabList>
      <TabPanel value="steps"><Text>{"The scan's steps."}</Text></TabPanel>
      <TabPanel value="logs"><Text>{"The scan's logs."}</Text></TabPanel>
      <TabPanel value="results"><Text>{"The scan's results."}</Text></TabPanel>
      <TabPanel value="enhancers"><Text>What the enhancers did.</Text></TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SelectedByClicking: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("tab", { name: "Logs" }));

    await expect(canvas.getByRole("tab", { name: "Logs" })).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel", { name: "Logs" })).toHaveTextContent("The scan's logs.");
    await expect(args.onValueChange).toHaveBeenCalledWith("logs");
  },
};

export const SelectedWithTheKeyboard: Story = {
  play: async ({ canvas }) => {
    const steps = canvas.getByRole("tab", { name: "Steps" });

    // Only the selected tab is in the tab order
    await userEvent.tab();
    await expect(steps).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Logs" })).toHaveFocus();
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("The scan's logs.");

    // The disabled Results tab is skipped
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Enhancers" })).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{ArrowRight}");
    await expect(steps).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{End}");
    await expect(canvas.getByRole("tab", { name: "Enhancers" })).toHaveFocus();

    await userEvent.keyboard("{Home}");
    await expect(steps).toHaveFocus();
  },
};

/**
 * The parent keeps the selected tab, such as in the URL.
 */
export const Controlled: Story = {
  args: { value: "logs", defaultValue: undefined },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("tab", { name: "Steps" }));

    // Reported, but stays on Logs until the parent changes value
    await expect(args.onValueChange).toHaveBeenCalledWith("steps");
    await expect(canvas.getByRole("tab", { name: "Logs" })).toHaveAttribute("aria-selected", "true");
  },
};
