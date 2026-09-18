import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReviewQueue } from "./ReviewQueue";

const meta = {
  title: "Verification/ReviewQueue",
  component: ReviewQueue,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ReviewQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { items: [] },
};

export const MixedVerdicts: Story = {
  args: {
    items: [
      { key: "a", label: "BDO Seidman v. Hirshberg", verdict: "accepted" },
      { key: "b", label: "Edwards v. Arthur Andersen LLP", verdict: "flagged" },
    ],
  },
};
