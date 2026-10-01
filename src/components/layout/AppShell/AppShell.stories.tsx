import type { Meta, StoryObj } from "@storybook/react-vite";
import { FoldersIcon, GearIcon, GraphIcon, PlayIcon, SparkleIcon, UserCircleIcon } from "@phosphor-icons/react/ssr";

import { Badge } from "../../ui/Badge/Badge";
import { Button } from "../../ui/Button/Button";
import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import { Text } from "../../ui/Text/Text";
import { Card, CardBody, CardHeader } from "../Card/Card";
import { Container } from "../Container/Container";
import { PageHeader } from "../PageHeader/PageHeader";
import { Section } from "../Section/Section";
import { NavGroup, NavItem, Sidebar } from "../Sidebar/Sidebar";
import { Stack } from "../Stack/Stack";

import { AppShell } from "./AppShell";

const meta = {
  title: "Layout/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen", padded: false },
  args: { header: null, children: null },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The layout components together, as a project page.
 */
export const ProjectPage: Story = {
  render: () => (
    <AppShell
      header={
        <div className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2 font-semibold">
            <Icon icon={GraphIcon} weight="duotone" className="text-primary" />
            GraphNous
          </span>
          <IconButton icon={UserCircleIcon} label="Account" />
        </div>
      }
      sidebar={
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
      }
    >
      <Container>
        <Stack gap={8}>
          <PageHeader
            title="backend"
            description="The shop's API: orders, payments and customers."
            breadcrumbs={[
              { label: "Systems", href: "/systems" },
              { label: "Shop", href: "/systems/shop" },
              { label: "backend" },
            ]}
            actions={<Button icon={PlayIcon}>Start scan</Button>}
          />
          <Section title="Scans">
            <Card>
              <CardHeader title="Scan of main" description="2 minutes ago" actions={<Badge tone="success">Completed</Badge>} />
              <CardBody>
                <Text size="sm" tone="secondary">1 target, 4 classes, 2 enhancers ran.</Text>
              </CardBody>
            </Card>
          </Section>
        </Stack>
      </Container>
    </AppShell>
  ),
};
