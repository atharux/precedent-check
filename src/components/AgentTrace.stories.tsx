import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { AgentTrace } from "./AgentTrace";
import { US_AGENT_STEPS } from "../data/agent";

const meta = {
  title: "Verification/AgentTrace",
  component: AgentTrace,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A simulated multi-step agent run, stepped through visibly rather than shown only as a finished result. Click Run agent to step through retrieve → rank → draft → self-check → escalate.",
      },
    },
  },
  args: { onAnnounce: fn(), onComplete: fn() },
} satisfies Meta<typeof AgentTrace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NonCompeteSteps: Story = {
  args: { steps: US_AGENT_STEPS },
};
