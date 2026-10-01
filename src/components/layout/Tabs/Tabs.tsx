"use client";

import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";

type TabsContextValue = {
  value: string;
  select: (value: string) => void;
  tabId: (value: string) => string;
  panelId: (value: string) => string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(`${component} must be inside Tabs`);
  }

  return context;
}

export type TabsProps = {
  /**
   * The selected tab, when the parent keeps it, such as in the URL.
   */
  value?: string;
  /**
   * The tab selected at first, when Tabs keeps it itself.
   */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
};

/**
 * Views of one thing, such as a scan's steps, logs and results, of which
 * one shows at a time. Follows the ARIA tabs pattern: the arrow keys, Home
 * and End move between tabs and select them.
 */
export function Tabs({ value, defaultValue = "", onValueChange, className, children }: TabsProps) {
  const [own, setOwn] = useState(defaultValue);
  const base = useId();

  const selected = value ?? own;
  const key = (tab: string) => tab.replace(/[^A-Za-z0-9_-]/g, "_");

  const context: TabsContextValue = {
    value: selected,
    select: (next) => {
      if (value === undefined) {
        setOwn(next);
      }

      onValueChange?.(next);
    },
    tabId: (tab) => `${base}-tab-${key(tab)}`,
    panelId: (tab) => `${base}-panel-${key(tab)}`,
  };

  return (
    <TabsContext.Provider value={context}>
      <div className={cn("flex flex-col gap-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export type TabListProps = {
  /**
   * What the tabs are about, for screen readers.
   */
  label: string;
  className?: string;
  children: ReactNode;
};

export function TabList({ label, className, children }: TabListProps) {
  const list = useRef<HTMLDivElement>(null);

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      list.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? [],
    );
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);

    const next = {
      ArrowRight: tabs[(current + 1) % tabs.length],
      ArrowLeft: tabs[(current - 1 + tabs.length) % tabs.length],
      Home: tabs[0],
      End: tabs[tabs.length - 1],
    }[event.key];

    if (next && current >= 0) {
      event.preventDefault();
      next.focus();
      next.click();
    }
  };

  return (
    <div
      ref={list}
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      onKeyDown={move}
      className={cn("flex gap-1 overflow-x-auto border-b border-border", className)}
    >
      {children}
    </div>
  );
}

export type TabProps = {
  value: string;
  icon?: PhosphorIcon;
  disabled?: boolean;
  children: ReactNode;
};

export function Tab({ value, icon, disabled = false, children }: TabProps) {
  const tabs = useTabs("Tab");
  const selected = tabs.value === value;

  return (
    <button
      type="button"
      role="tab"
      id={tabs.tabId(value)}
      aria-selected={selected}
      aria-controls={tabs.panelId(value)}
      // Only the selected tab is in the tab order; the arrow keys reach the others
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => tabs.select(value)}
      className={cn(
        "-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-primary text-foreground"
          : "border-transparent text-foreground-secondary hover:border-border hover:text-foreground",
      )}
    >
      {icon && <Icon icon={icon} size="sm" />}
      {children}
    </button>
  );
}

export type TabPanelProps = {
  value: string;
  className?: string;
  children: ReactNode;
};

export function TabPanel({ value, className, children }: TabPanelProps) {
  const tabs = useTabs("TabPanel");

  if (tabs.value !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={tabs.panelId(value)}
      aria-labelledby={tabs.tabId(value)}
      tabIndex={0}
      className={cn("rounded-sm", className)}
    >
      {children}
    </div>
  );
}
