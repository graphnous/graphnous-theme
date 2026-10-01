import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../../ui/Button/Button";

import { ToastProvider, useToast, type ToastOptions } from "./Toast";

function Trigger({ label, options }: { label: string; options: ToastOptions }) {
  const { toast } = useToast();

  return (
    <Button variant="secondary" onClick={() => toast(options)}>
      {label}
    </Button>
  );
}

function Demo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Trigger label="Delete scan" options={{ title: "Scan deleted", tone: "success" }} />
      <Trigger
        label="Upload results"
        options={{
          title: "Results uploaded",
          description: "Storing and enhancing continue in the background.",
          tone: "info",
          action: { label: "View scan", onClick: () => {} },
        }}
      />
      <Trigger
        label="Fail a scan"
        options={{ title: "The checkout failed", description: "Repository not found.", tone: "error" }}
      />
      <Trigger label="Quick toast" options={{ title: "Copied", duration: 300 }} />
    </div>
  );
}

const meta = {
  title: "Feedback/Toast",
  component: Demo,
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShownAndDismissed: Story = {
  play: async ({ canvas, canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole("button", { name: "Delete scan" }));

    const notifications = page.getByRole("region", { name: "Notifications" });
    await expect(notifications).toHaveTextContent("Scan deleted");

    await userEvent.click(within(notifications).getByRole("button", { name: "Dismiss" }));
    await expect(notifications).not.toHaveTextContent("Scan deleted");
  },
};

export const ErrorsStayUntilDismissed: Story = {
  play: async ({ canvas, canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole("button", { name: "Fail a scan" }));
    await userEvent.click(canvas.getByRole("button", { name: "Quick toast" }));

    const notifications = page.getByRole("region", { name: "Notifications" });

    // The quick toast disappears on its own, the error stays
    await waitFor(() => expect(notifications).not.toHaveTextContent("Copied"), { timeout: 3000 });
    await expect(notifications).toHaveTextContent("The checkout failed");

    // Errors go in the assertive live region
    await expect(notifications.querySelector('[aria-live="assertive"]')).toHaveTextContent("The checkout failed");
  },
};
