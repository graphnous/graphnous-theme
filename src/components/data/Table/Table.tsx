"use client";

import { useId, type ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon, ArrowsDownUpIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Skeleton } from "../../feedback/Skeleton/Skeleton";
import { Icon } from "../../ui/Icon/Icon";
import { VisuallyHidden } from "../../ui/VisuallyHidden/VisuallyHidden";

export type SortDirection = "asc" | "desc";

/**
 * How the rows are sorted, as the API's list endpoints take it.
 */
export type Sort<Field extends string = string> = {
  field: Field;
  direction: SortDirection;
};

export type Column<Row> = {
  /**
   * The column's id; for a sortable column, the field the API sorts by.
   */
  key: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  /**
   * Whether the API can sort by this column's key.
   */
  sortable?: boolean;
  /**
   * end: for numbers and actions.
   */
  align?: "start" | "end";
  className?: string;
};

export type TableProps<Row, Field extends string = string> = {
  /**
   * What the table shows, such as "Projects"; for screen readers, unless
   * showCaption.
   */
  caption: string;
  showCaption?: boolean;
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  sort?: Sort<Field>;
  /**
   * Called with the new sort when a sortable header is clicked: ascending
   * first, then the other way.
   */
  onSortChange?: (sort: Sort<Field>) => void;
  /**
   * The actions of a row, such as a Menu, in a last column.
   */
  rowActions?: (row: Row) => ReactNode;
  /**
   * Shows placeholder rows, or a bar above the rows while newer ones load.
   */
  loading?: boolean;
  /**
   * The number of placeholder rows while loading.
   */
  loadingRows?: number;
  /**
   * Shown when there are no rows, such as an EmptyState.
   */
  empty?: ReactNode;
  className?: string;
};

const directions = { asc: "ascending", desc: "descending" } as const;

/**
 * Rows and columns, such as the projects of a system, with headers that
 * sort through the API.
 */
export function Table<Row, Field extends string = string>({
  caption,
  showCaption = false,
  columns,
  rows,
  rowKey,
  sort,
  onSortChange,
  rowActions,
  loading = false,
  loadingRows = 5,
  empty,
  className,
}: TableProps<Row, Field>) {
  const captionId = useId();
  const columnCount = columns.length + (rowActions ? 1 : 0);
  const placeholders = loading && rows.length === 0;

  if (!loading && rows.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    // Focusable, so the keyboard can scroll it sideways on small screens
    <div
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
      className={cn("relative overflow-x-auto rounded-card border border-border bg-surface", className)}
    >
      {loading && !placeholders && (
        <div aria-hidden className="absolute inset-x-0 top-0 h-0.5 animate-pulse bg-primary motion-reduce:animate-none" />
      )}
      <table aria-busy={loading || undefined} className="w-full border-collapse text-left text-sm">
        <caption
          id={captionId}
          className={cn(showCaption ? "px-4 pt-3 text-left font-semibold text-foreground" : "sr-only")}
        >
          {caption}
        </caption>
        <thead className="border-b border-border bg-surface-elevated">
          <tr>
            {columns.map((column) => {
              const sorted = sort?.field === column.key ? sort.direction : undefined;

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={sorted ? directions[sorted] : undefined}
                  className={cn(
                    "px-4 py-2.5 text-xs font-semibold text-foreground-secondary",
                    column.align === "end" && "text-right",
                    column.className,
                  )}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() =>
                        onSortChange({ field: column.key as Field, direction: sorted === "asc" ? "desc" : "asc" })
                      }
                      className={cn(
                        "-mx-1 inline-flex items-center gap-1 rounded-control px-1 hover:text-foreground",
                        sorted && "text-foreground",
                      )}
                    >
                      {column.header}
                      <Icon
                        icon={sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowsDownUpIcon}
                        size="xs"
                        className={cn(!sorted && "text-foreground-muted")}
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
            {rowActions && (
              <th scope="col" className="w-0 px-4 py-2.5">
                <VisuallyHidden>Actions</VisuallyHidden>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {placeholders
            ? Array.from({ length: loadingRows }, (_, index) => (
                <tr key={index}>
                  <td colSpan={columnCount} className="px-4 py-3">
                    {index === 0 && <VisuallyHidden>Loading</VisuallyHidden>}
                    <Skeleton />
                  </td>
                </tr>
              ))
            : rows.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-surface-elevated/50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-3 text-foreground",
                        column.align === "end" && "text-right",
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                  {rowActions && <td className="px-4 py-1.5 text-right">{rowActions(row)}</td>}
                </tr>
              ))}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columnCount} className="px-4 py-8 text-center text-foreground-secondary">
                Nothing to show
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
