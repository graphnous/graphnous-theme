"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon, WarningIcon } from "@phosphor-icons/react/ssr";

import { IconButton } from "../../ui/IconButton/IconButton";
import { VisuallyHidden } from "../../ui/VisuallyHidden/VisuallyHidden";

export type CopyButtonProps = {
  value: string;
  /**
   * What it copies, such as "Copy the scan's id".
   */
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

type State = "idle" | "copied" | "failed";

/**
 * Copies a value to the clipboard, such as an id, and confirms it with a
 * check mark and to screen readers.
 */
export function CopyButton({ value, label = "Copy", size = "sm", className }: CopyButtonProps) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = setTimeout(() => setState("idle"), 2000);
  };

  return (
    <>
      <IconButton
        icon={state === "copied" ? CheckIcon : state === "failed" ? WarningIcon : CopyIcon}
        label={label}
        size={size}
        onClick={copy}
        className={className}
      />
      <VisuallyHidden>
        <span role="status">{state === "copied" ? "Copied" : state === "failed" ? "Could not copy" : ""}</span>
      </VisuallyHidden>
    </>
  );
}
