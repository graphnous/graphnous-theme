/**
 * The classes of a text input, shared by TextInput, TextArea, Select,
 * Combobox and SearchInput.
 */
export const controlStyles = [
  "w-full rounded-control border border-border-strong bg-surface text-sm text-foreground transition-colors",
  "placeholder:text-foreground-muted hover:border-foreground-secondary focus-visible:outline-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border-strong",
  "aria-invalid:border-error",
].join(" ");
