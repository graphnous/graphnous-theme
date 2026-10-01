import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Breadcrumbs } from "./Breadcrumbs";

const meta = {
  title: "Layout/Breadcrumbs",
  component: Breadcrumbs,
  args: {
    items: [
      { label: "Systems", href: "/systems" },
      { label: "Shop", href: "/systems/shop" },
      { label: "backend", href: "/projects/backend" },
      { label: "Scan of main" },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "Breadcrumb" });

    await expect(nav).toBeVisible();
    await expect(canvas.getByText("Scan of main")).toHaveAttribute("aria-current", "page");
    await expect(canvas.getAllByRole("link")).toHaveLength(3);
  },
};

export const Long: Story = {
  args: {
    items: [
      { label: "Systems", href: "/systems" },
      { label: "A system with a rather long name", href: "/systems/long" },
      { label: "a-project-with-an-even-longer-name-than-its-system", href: "/projects/long" },
      { label: "Scan" },
    ],
  },
  render: (args) => (
    <div className="max-w-sm">
      <Breadcrumbs {...args} />
    </div>
  ),
};
