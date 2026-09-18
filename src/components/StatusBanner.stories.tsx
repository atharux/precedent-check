import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBanner } from "./StatusBanner";

const meta = {
  title: "Verification/StatusBanner",
  component: StatusBanner,
  parameters: { layout: "padded" },
} satisfies Meta<typeof StatusBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClauseBlocked: Story = {
  args: {
    flag: "Clause blocked",
    children:
      "Governing law is California — Bus. & Prof. Code §16600 voids employee non-competes with narrow statutory exceptions. The citations below can still be binding or persuasive as case law, but the covenant itself is likely unenforceable as drafted.",
  },
};

export const GapFlagged: Story = {
  args: {
    flag: "Gap flagged",
    children:
      "§630h Abs. 1 BGB is the category that most directly covers this incident. No confirmed published German case matching this category was found in this corpus — that gap is shown, not hidden.",
  },
};
