import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code, CodeBlock } from "./Code";

const meta = {
  title: "Primitives/Code",
  component: Code,
  args: { children: "com.example.Order" },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  render: (args) => (
    <p>
      Class <Code {...args} /> extends <Code>com.example.Entity</Code>.
    </p>
  ),
};

export const Block: Story = {
  render: () => (
    <CodeBlock>
      {`Checking out https://github.com/spring-guides/gs-rest-service.git (branch main)
Found 1 target
[1/1] Scanning JAVA .
Scanned 1 module, 4 files (1 test), 4 classes`}
    </CodeBlock>
  ),
};

export const BlockWrapped: Story = {
  render: () => (
    <CodeBlock wrap className="max-w-md">
      Checkout of https://github.com/graphnous/does-not-exist.git failed with exit code 128: repository not found
    </CodeBlock>
  ),
};
