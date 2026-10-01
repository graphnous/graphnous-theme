import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

import { Pagination, type PaginationProps } from "./Pagination";

function WithState(args: PaginationProps) {
  const [page, setPage] = useState(args.page);
  const [size, setSize] = useState(args.size);

  return (
    <Pagination
      {...args}
      page={page}
      size={size}
      totalPages={Math.ceil(args.totalElements / size)}
      onPageChange={(next) => {
        setPage(next);
        args.onPageChange(next);
      }}
      onSizeChange={
        args.onSizeChange &&
        ((next) => {
          setSize(next);
          setPage(0);
          args.onSizeChange?.(next);
        })
      }
    />
  );
}

const meta = {
  title: "Data/Pagination",
  component: Pagination,
  args: { page: 0, size: 20, totalElements: 132, totalPages: 7, onPageChange: fn() },
  render: (args) => <WithState {...args} />,
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas }) => {
    await expect(canvas.getByText("1–20 of 132")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Previous page" })).toBeDisabled();

    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(args.onPageChange).toHaveBeenCalledWith(1);
    await expect(canvas.getByText("21–40 of 132")).toBeVisible();
    await expect(canvas.getByText("Page 2 of 7")).toBeVisible();
  },
};

export const LastPage: Story = {
  args: { page: 6 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("121–132 of 132")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Next page" })).toBeDisabled();
  },
};

export const WithPageSizes: Story = {
  args: { page: 3, onSizeChange: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "Rows per page" }), "50");

    await expect(args.onSizeChange).toHaveBeenCalledWith(50);
    await expect(canvas.getByText("1–50 of 132")).toBeVisible();
    await expect(canvas.getByText("Page 1 of 3")).toBeVisible();
  },
};

export const Empty: Story = {
  args: { totalElements: 0, totalPages: 0 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("0–0 of 0")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Next page" })).toBeDisabled();
  },
};
