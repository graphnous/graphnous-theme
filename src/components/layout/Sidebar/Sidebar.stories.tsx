import type { Meta, StoryObj } from "@storybook/react-vite";
import { FoldersIcon, GearIcon, GraphIcon, SparkleIcon } from "@phosphor-icons/react/ssr";
import { expect } from "storybook/test";

import { NavGroup, NavItem, Sidebar } from "./Sidebar";

const meta = {
  title: "Layout/Sidebar",
  component: Sidebar,
  args: { children: null },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-60 rounded-card border border-border bg-surface">
      <Sidebar>
        <NavGroup>
          <NavItem href="/systems" icon={FoldersIcon} active>Systems</NavItem>
          <NavItem href="/graph" icon={GraphIcon}>Graph</NavItem>
          <NavItem href="/enhancers" icon={SparkleIcon}>Enhancers</NavItem>
        </NavGroup>
        <NavGroup title="Account">
          <NavItem href="/settings" icon={GearIcon}>Settings</NavItem>
        </NavGroup>
      </Sidebar>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Systems" })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("link", { name: "Graph" })).not.toHaveAttribute("aria-current");
  },
};
