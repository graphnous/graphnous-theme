"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { XIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import { toneIcons, toneSurfaces, type Tone } from "../tones";

export type ToastOptions = {
  title: string;
  description?: ReactNode;
  tone?: Tone;
  /**
   * A button in the toast, such as "Undo" or "View scan".
   */
  action?: { label: string; onClick: () => void };
  /**
   * Milliseconds until it disappears; null keeps it until dismissed. By
   * default errors stay, other toasts disappear after five seconds.
   */
  duration?: number | null;
};

type Toast = ToastOptions & { id: number };

type ToastContextValue = {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Shows short-lived messages, such as "Scan deleted", from anywhere below
 * it; call useToast() to show one.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++;

    setToasts((current) => [...current, { ...options, id }]);

    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  // Errors interrupt screen readers; other toasts wait their turn. The live
  // regions stay in the page, as screen readers only announce changes to
  // regions they already know.
  const urgent = toasts.filter((toast) => toast.tone === "error");
  const polite = toasts.filter((toast) => toast.tone !== "error");

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section
        aria-label="Notifications"
        className="pointer-events-none fixed right-0 bottom-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4"
      >
        <div aria-live="assertive" className="flex flex-col gap-2">
          {urgent.map((toast) => (
            <ToastItem key={toast.id} toast={toast} dismiss={dismiss} />
          ))}
        </div>
        <div aria-live="polite" className="flex flex-col gap-2">
          {polite.map((toast) => (
            <ToastItem key={toast.id} toast={toast} dismiss={dismiss} />
          ))}
        </div>
      </section>
    </ToastContext.Provider>
  );
}

/**
 * Takes the provider's stable dismiss, so adding a toast does not restart
 * the timers of the toasts already showing.
 */
function ToastItem({ toast, dismiss }: { toast: Toast; dismiss: (id: number) => void }) {
  const tone = toast.tone ?? "neutral";
  const id = toast.id;
  const duration = toast.duration === undefined ? (tone === "error" ? null : 5000) : toast.duration;

  // Paused while the pointer or focus is on it, so it can be read and used
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (duration === null || paused) {
      return;
    }

    const timer = setTimeout(() => dismiss(id), duration);

    return () => clearTimeout(timer);
  }, [duration, paused, dismiss, id]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex gap-3 rounded-card border p-4 text-sm shadow-lg",
        toneSurfaces[tone],
        tone === "neutral" && "bg-surface",
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon icon={toneIcons[tone]} weight="fill" className="mt-px" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-semibold">{toast.title}</p>
        {toast.description && <div className="text-foreground">{toast.description}</div>}
        {toast.action && (
          <button
            type="button"
            className="mt-1 self-start rounded-sm font-medium underline underline-offset-4"
            onClick={() => {
              toast.action?.onClick();
              dismiss(id);
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <IconButton icon={XIcon} label="Dismiss" size="sm" onClick={() => dismiss(id)} className="-my-1 -mr-1 text-current" />
    </div>
  );
}

/**
 * toast(options) shows a message and returns its id; dismiss(id) removes it.
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
