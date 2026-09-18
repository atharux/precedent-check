import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CiteChip } from "./CiteChip";

const meta = {
  title: "Verification/CiteChip",
  component: CiteChip,
  parameters: { layout: "centered" },
  args: { onClick: fn() },
} satisfies Meta<typeof CiteChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Binding: Story = {
  args: { label: "BDO Seidman v. Hirshberg", status: "binding", index: 2 },
};

export const Persuasive: Story = {
  args: { label: "Edwards v. Arthur Andersen LLP", status: "persuasive", index: 1 },
};

export const Blocked: Story = {
  args: { label: "Edwards v. Arthur Andersen LLP", status: "blocked", index: 1 },
};

export const Pressed: Story = {
  args: { label: "BDO Seidman v. Hirshberg", status: "binding", index: 2, pressed: true },
};
