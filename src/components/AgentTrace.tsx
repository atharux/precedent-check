import { useEffect, useRef, useState } from "react";
import type { AgentStep } from "../types";

interface AgentTraceProps {
  steps: AgentStep[];
  onAnnounce?: (message: string) => void;
  onComplete?: () => void;
}

type StepStatus = "pending" | "running" | "done";

/**
 * A simulated multi-step agent run, stepped through visibly rather than shown
 * only as a finished result. No live model call executes here — a real
 * version would call an LLM through a backend, which a static front end can't
 * do on its own — the point is the interaction pattern: a process made
 * legible and interruptible while it runs, feeding a human review gate.
 */
export function AgentTrace({ steps, onAnnounce, onComplete }: AgentTraceProps) {
  const [statuses, setStatuses] = useState<StepStatus[]>(() => steps.map(() => "pending"));
  const [running, setRunning] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  function run() {
    if (running) return;
    setRunning(true);
    setStatuses(steps.map(() => "pending"));

    let i = 0;
    const step = () => {
      setStatuses((prev) => prev.map((s, idx) => (idx === i ? "running" : idx < i ? "done" : s)));
      onAnnounce?.(`${steps[i].label}: ${steps[i].detail}`);
      timeoutRef.current = window.setTimeout(() => {
        setStatuses((prev) => prev.map((s, idx) => (idx <= i ? "done" : s)));
        i += 1;
        if (i < steps.length) {
          step();
        } else {
          setRunning(false);
          onComplete?.();
        }
      }, 650);
    };
    step();
  }

  return (
    <>
      <button type="button" className="act accept agent-run-btn" onClick={run} disabled={running}>
        {running ? "Running…" : "▶ Run agent"}
      </button>
      <ol className="agent-log">
        {steps.map((s, idx) => {
          const status = statuses[idx];
          return (
            <li key={s.key} className={`agent-step ${status !== "pending" ? "active" : ""}`}>
              <span className="as-n">{idx + 1}</span>
              <span className={`as-status ${status}`}>{status}</span>
              <span className="as-body">
                <b>{s.label}</b>
                <div className="as-detail">{s.detail}</div>
                {s.key === "escalate" && status === "done" && (
                  <div className="agent-escalate">
                    Nothing below is final — see Plate 03 for the human sign-off gate.
                  </div>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </>
  );
}
