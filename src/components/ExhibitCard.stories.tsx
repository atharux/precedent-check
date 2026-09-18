import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ExhibitCard } from "./ExhibitCard";

const meta = {
  title: "Verification/ExhibitCard",
  component: ExhibitCard,
  parameters: { layout: "padded" },
  args: { onAccept: fn(), onFlag: fn() },
} satisfies Meta<typeof ExhibitCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BindingWithChain: Story = {
  args: {
    status: "binding",
    statusLabel: "Binding — same jurisdiction",
    title: "BDO Seidman v. Hirshberg",
    meta: "New York Court of Appeals · decided 1999-05-13 · 712 N.E.2d 1220",
    quote: "BDO SEIDMAN, Appellant, v. JEFFREY HIRSHBERG, Respondent.",
    figcaption: "Verbatim excerpt, public-domain opinion text.",
    children: (
      <div className="reasoning">
        <b>Why this status:</b> Decided by a NY court. Contract&rsquo;s governing law is also NY.
      </div>
    ),
  },
};

export const PersuasiveOnly: Story = {
  args: {
    status: "persuasive",
    statusLabel: "Persuasive only — jurisdiction mismatch",
    title: "Marsh USA Inc. v. Cook",
    meta: "Texas Supreme Court · decided 2011-12-16 · 354 S.W.3d 764",
    quote: "In this case, we decide whether a covenant not to compete… is enforceable.",
    figcaption: "Verbatim excerpt, public-domain opinion text.",
    children: (
      <div className="suggestion">
        <b>Same-jurisdiction authority available in corpus:</b> BDO Seidman v. Hirshberg — not
        currently cited.
      </div>
    ),
  },
};

export const AlreadyDecided: Story = {
  args: {
    ...BindingWithChain.args,
    verdict: "accepted",
  },
};
