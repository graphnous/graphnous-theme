import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Link } from "./Link";
import { LinkProvider, type RouterLinkProps } from "./LinkProvider";

/**
 * Stands in for a router's link, such as Next.js' Link.
 */
function RouterLink(props: RouterLinkProps) {
  return <a data-router-link="" {...props} />;
}

const meta = {
  title: "Primitives/Link",
  component: Link,
  args: { href: "/systems/shop", children: "Shop" },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  args: { href: "https://github.com/spring-guides/gs-rest-service", external: true, children: "gs-rest-service" },
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: /gs-rest-service/ });

    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link).toHaveAccessibleName("gs-rest-service (opens in a new tab)");
  },
};

export const InText: Story = {
  render: () => (
    <p className="text-foreground-secondary">
      Scanned <Link href="/projects/backend">backend</Link> of <Link href="/systems/shop">Shop</Link>.
    </p>
  ),
};

/**
 * Within a LinkProvider, links go through the app's router.
 */
export const WithRouter: Story = {
  decorators: [
    (Story) => (
      <LinkProvider component={RouterLink}>
        <Story />
      </LinkProvider>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Shop" })).toHaveAttribute("data-router-link");
  },
};
