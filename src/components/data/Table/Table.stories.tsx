import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotsThreeIcon, FolderIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react/ssr";
import { expect, fn, screen, userEvent, within } from "storybook/test";

import { EmptyState } from "../../feedback/EmptyState/EmptyState";
import { Menu } from "../../overlays/Menu/Menu";
import { IconButton } from "../../ui/IconButton/IconButton";
import { StatusIndicator } from "../StatusIndicator/StatusIndicator";

import { Table, type Column, type Sort, type TableProps } from "./Table";

type Project = { id: string; name: string; repository: string; scans: number; status: "Completed" | "Running" | "Failed" };

const projects: Project[] = [
  { id: "1", name: "Graphnous", repository: "github.com/graphnous/graphnous", scans: 42, status: "Completed" },
  { id: "2", name: "Pet Clinic", repository: "github.com/spring-projects/spring-petclinic", scans: 7, status: "Running" },
  { id: "3", name: "Shop", repository: "gitlab.com/acme/shop", scans: 128, status: "Failed" },
];

const tones = { Completed: "success", Running: "info", Failed: "error" } as const;

const columns: Column<Project>[] = [
  { key: "name", header: "Name", sortable: true, cell: (project) => <span className="font-medium">{project.name}</span> },
  { key: "repository", header: "Repository", cell: (project) => project.repository },
  {
    key: "status",
    header: "Last scan",
    cell: (project) => (
      <StatusIndicator tone={tones[project.status]} active={project.status === "Running"}>
        {project.status}
      </StatusIndicator>
    ),
  },
  { key: "scans", header: "Scans", sortable: true, align: "end", cell: (project) => project.scans },
];

/**
 * Sorts the rows as the API would.
 */
function Sorted(args: TableProps<Project>) {
  const [sort, setSort] = useState<Sort>(args.sort ?? { field: "name", direction: "asc" });
  const rows = [...args.rows].sort((a, b) => {
    const field = sort.field as "name" | "scans";
    const order = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
    return sort.direction === "asc" ? order : -order;
  });

  return (
    <Table
      {...args}
      rows={rows}
      sort={sort}
      onSortChange={(next) => {
        setSort(next);
        args.onSortChange?.(next);
      }}
    />
  );
}

const meta = {
  title: "Data/Table",
  component: Table<Project>,
  args: {
    caption: "Projects",
    columns,
    rows: projects,
    rowKey: (project) => project.id,
    onSortChange: fn(),
  },
  render: (args) => <Sorted {...args} />,
} satisfies Meta<typeof Table<Project>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sorting: Story = {
  play: async ({ args, canvas }) => {
    const table = canvas.getByRole("table", { name: "Projects" });
    const firstNames = () => within(table).getAllByRole("row").slice(1).map((row) => (row as HTMLTableRowElement).cells[0].textContent);

    await expect(canvas.getByRole("columnheader", { name: /Name/ })).toHaveAttribute("aria-sort", "ascending");
    await expect(firstNames()).toEqual(["Graphnous", "Pet Clinic", "Shop"]);

    await userEvent.click(canvas.getByRole("button", { name: "Scans" }));
    await expect(args.onSortChange).toHaveBeenLastCalledWith({ field: "scans", direction: "asc" });
    await expect(canvas.getByRole("columnheader", { name: /Scans/ })).toHaveAttribute("aria-sort", "ascending");
    await expect(canvas.getByRole("columnheader", { name: /Name/ })).not.toHaveAttribute("aria-sort");

    // Again: the other way
    await userEvent.click(canvas.getByRole("button", { name: "Scans" }));
    await expect(args.onSortChange).toHaveBeenLastCalledWith({ field: "scans", direction: "desc" });
    await expect(firstNames()).toEqual(["Shop", "Graphnous", "Pet Clinic"]);
  },
};

export const WithRowActions: Story = {
  args: {
    rowActions: (project) => (
      <Menu
        trigger={<IconButton icon={DotsThreeIcon} label={`Actions for ${project.name}`} size="sm" />}
        items={[
          { label: "Rename", icon: PencilSimpleIcon, onSelect: fn() },
          { label: "Delete", icon: TrashIcon, onSelect: fn(), danger: true },
        ]}
      />
    ),
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Actions for Shop" }));
    await expect(screen.getByRole("menu")).toBeVisible();
  },
};

export const Loading: Story = {
  args: { rows: [], loading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("table")).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByText("Loading")).toBeInTheDocument();
  },
};

export const Reloading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: { rows: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("cell", { name: "Nothing to show" })).toBeInTheDocument();
  },
};

export const EmptyWithEmptyState: Story = {
  args: {
    rows: [],
    empty: <EmptyState icon={FolderIcon} title="No projects yet" description="Add a repository to scan it." />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("table")).toBeNull();
    await expect(canvas.getByRole("heading", { name: "No projects yet" })).toBeVisible();
  },
};

export const WithCaption: Story = {
  args: { showCaption: true },
};
