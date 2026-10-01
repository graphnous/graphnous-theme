"use client";

import { useId, useRef, useState } from "react";
import { FileIcon, TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";
import { formatBytes } from "../../../lib/format";

import { Button } from "../../ui/Button/Button";
import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import { useFieldProps } from "../Field/Field";

export type FileDropProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  /**
   * The file types it takes, as for an <input type="file">, such as
   * ".json" or "application/json"; dropped files of other types are left
   * out, with a message.
   */
  accept?: string;
  multiple?: boolean;
  /**
   * What to drop, such as "Drop scan result files here".
   */
  prompt?: string;
  disabled?: boolean;
  className?: string;
};

function accepts(file: File, accept: string | undefined): boolean {
  if (!accept) {
    return true;
  }

  return accept.split(",").some((type) => {
    const pattern = type.trim().toLowerCase();

    if (pattern.startsWith(".")) {
      return file.name.toLowerCase().endsWith(pattern);
    }
    if (pattern.endsWith("/*")) {
      return file.type.startsWith(pattern.slice(0, -1));
    }
    return file.type === pattern;
  });
}

function sameFile(a: File, b: File): boolean {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

/**
 * Dropping or picking files, in a Field, such as scan results to upload.
 * Lists each file with its size and a button to remove it.
 */
export function FileDrop({
  files,
  onFilesChange,
  accept,
  multiple = true,
  prompt = "Drop files here",
  disabled,
  className,
}: FileDropProps) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);
  const rejectedId = useId();
  const field = useFieldProps({ disabled });

  const add = (list: FileList | null) => {
    const added = Array.from(list ?? []);
    const valid = added.filter((file) => accepts(file, accept));
    const fresh = valid.filter((file) => !files.some((existing) => sameFile(existing, file)));

    setRejected(added.filter((file) => !valid.includes(file)).map((file) => file.name));
    if (fresh.length > 0) {
      onFilesChange(multiple ? [...files, ...fresh] : fresh.slice(0, 1));
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!field.disabled) {
            setDragging(true);
          }
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!field.disabled) {
            add(event.dataTransfer.files);
          }
        }}
        className={cn(
          "flex flex-col items-center gap-2 rounded-card border-2 border-dashed border-border-strong px-6 py-8 text-center transition-colors",
          dragging && "border-primary bg-primary-subtle",
          field.disabled && "bg-surface-elevated",
        )}
      >
        <Icon icon={UploadSimpleIcon} size="lg" className="text-foreground-muted" />
        <p className="text-sm text-foreground-secondary">{prompt}, or</p>
        <Button
          variant="secondary"
          size="sm"
          disabled={field.disabled}
          aria-describedby={[field["aria-describedby"], rejected.length > 0 && rejectedId].filter(Boolean).join(" ") || undefined}
          onClick={() => input.current?.click()}
        >
          {multiple ? "Choose files" : "Choose a file"}
        </Button>
        <input
          ref={input}
          id={field.id}
          type="file"
          hidden
          accept={accept}
          multiple={multiple}
          disabled={field.disabled}
          onChange={(event) => {
            add(event.currentTarget.files);
            // So choosing the same file again, after removing it, adds it
            event.currentTarget.value = "";
          }}
        />
      </div>
      {rejected.length > 0 && (
        <p id={rejectedId} role="status" className="text-xs font-medium text-error-soft-foreground">
          Not added, as {accept ? `only ${accept} files are allowed` : "it is not allowed"}: {rejected.join(", ")}
        </p>
      )}
      {files.length > 0 && (
        <ul aria-label="Chosen files" className="flex flex-col divide-y divide-border rounded-card border border-border">
          {files.map((file) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center gap-3 py-1.5 pr-1.5 pl-3">
              <Icon icon={FileIcon} size="sm" className="text-foreground-muted" />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">{file.name}</span>
              <span className="text-xs whitespace-nowrap text-foreground-muted">{formatBytes(file.size)}</span>
              <IconButton
                icon={TrashIcon}
                label={`Remove ${file.name}`}
                size="sm"
                disabled={field.disabled}
                onClick={() => onFilesChange(files.filter((existing) => existing !== file))}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
