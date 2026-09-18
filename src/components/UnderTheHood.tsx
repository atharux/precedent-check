import type { CypherQuery } from "../types";

interface UnderTheHoodProps {
  queries: CypherQuery[];
  note: string;
}

/** Real Cypher + real output, expandable, for the reader who wants the mechanism, not just the verdict. */
export function UnderTheHood({ queries, note }: UnderTheHoodProps) {
  return (
    <>
      <p className="hood-note">{note}</p>
      <details className="hood">
        <summary>
          Real Cypher queries + real output <span className="toggle">expand</span>
        </summary>
        <div className="hood-body">
          <div className="qgrid">
            {queries.map((q) => (
              <div className="qcard" key={q.question}>
                <div className="qhead">{q.question}</div>
                <pre>{q.cypher}</pre>
                <div className="qout" style={q.isEmpty ? { color: "var(--persuasive)" } : undefined}>
                  {q.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </>
  );
}
