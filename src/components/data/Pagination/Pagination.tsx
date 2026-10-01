"use client";

import { useId } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Select } from "../../forms/Select/Select";
import { IconButton } from "../../ui/IconButton/IconButton";

export type PaginationProps = {
  /**
   * The zero-based page, as the API counts them.
   */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /**
   * Shows a choice of page sizes; choosing one goes back to the first page.
   */
  onSizeChange?: (size: number) => void;
  sizes?: number[];
  className?: string;
};

const count = new Intl.NumberFormat("en");

/**
 * Moving through the pages of a list, matching the API's pages: which rows
 * show, the page, and previous and next.
 */
export function Pagination({
  page,
  size,
  totalElements,
  totalPages,
  onPageChange,
  onSizeChange,
  sizes = [10, 20, 50, 100],
  className,
}: PaginationProps) {
  const sizeId = useId();
  const first = totalElements === 0 ? 0 : page * size + 1;
  const last = Math.min((page + 1) * size, totalElements);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm", className)}
    >
      <p className="text-foreground-secondary tabular-nums">
        {count.format(first)}–{count.format(last)} of {count.format(totalElements)}
      </p>
      <div className="flex items-center gap-4">
        {onSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor={sizeId} className="whitespace-nowrap text-foreground-secondary">
              Rows per page
            </label>
            <Select
              id={sizeId}
              value={String(size)}
              onChange={(event) => onSizeChange(Number(event.currentTarget.value))}
              options={sizes.map((option) => ({ value: String(option), label: String(option) }))}
              className="h-8 w-20"
            />
          </div>
        )}
        <div className="flex items-center gap-1">
          <IconButton
            icon={CaretLeftIcon}
            label="Previous page"
            size="sm"
            variant="secondary"
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
          />
          <p aria-live="polite" className="px-2 whitespace-nowrap text-foreground tabular-nums">
            Page {count.format(totalPages === 0 ? 0 : page + 1)} of {count.format(totalPages)}
          </p>
          <IconButton
            icon={CaretRightIcon}
            label="Next page"
            size="sm"
            variant="secondary"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
          />
        </div>
      </div>
    </nav>
  );
}
