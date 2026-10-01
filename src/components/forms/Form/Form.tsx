"use client";

import { createContext, useContext, useState, type ComponentPropsWithRef, type FormEvent, type ReactNode } from "react";

import { cn } from "../../../lib/cn";

import { Alert } from "../../feedback/Alert/Alert";
import { Button, type ButtonProps } from "../../ui/Button/Button";

const FormContext = createContext({ submitting: false });

export type FormProps = Omit<ComponentPropsWithRef<"form">, "onSubmit"> & {
  /**
   * Gets the form's values; while the promise it returns is pending, the
   * submit button shows a spinner and the form is not submitted again.
   */
  onSubmit: (data: FormData, event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  /**
   * What went wrong submitting it, such as the API's error message; shown
   * above the fields and announced to screen readers. Errors about one
   * field go on its Field instead.
   */
  error?: ReactNode;
  children: ReactNode;
};

/**
 * A form that submits its values to a function, with a loading state and
 * an error from the server. The browser checks required fields and types
 * first.
 */
export function Form({ onSubmit, error, className, children, ...props }: FormProps) {
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const data = new FormData(event.currentTarget, submitter);

    setSubmitting(true);
    try {
      await onSubmit(data, event);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form {...props} onSubmit={submit} aria-busy={submitting || undefined} className={cn("flex flex-col gap-4", className)}>
      {error && (
        <Alert tone="error" announce>
          {error}
        </Alert>
      )}
      <FormContext value={{ submitting }}>{children}</FormContext>
    </form>
  );
}

/**
 * The button that submits a Form; it shows a spinner while it submits.
 */
export function SubmitButton({ loading, ...props }: Omit<ButtonProps, "type">) {
  const { submitting } = useContext(FormContext);

  return <Button {...props} type="submit" loading={loading || submitting} />;
}
