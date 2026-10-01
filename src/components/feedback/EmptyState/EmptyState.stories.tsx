import type { Meta, StoryObj } from "@storybook/react-vite";
import { FoldersIcon, PlayIcon, UploadSimpleIcon } from "@phosphor-icons/react/ssr";

import { Button } from "../../ui/Button/Button";

import { EmptyState } from "./EmptyState";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  args: {
    icon: PlayIcon,
    title: "No scans yet",
    description: "Scan the project's repository, or upload results scanned in CI.",
    action: (
      <div className="flex gap-2">
        <Button variant="secondary" icon={UploadSimpleIcon}>Upload results</Button>
        <Button icon={PlayIcon}>Start scan</Button>
      </div>
    ),
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutAction: Story = {
  args: {
    icon: FoldersIcon,
    title: "No systems",
    description: "Systems group the projects of one application.",
    action: undefined,
  },
};
