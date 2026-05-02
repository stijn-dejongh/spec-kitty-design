// ComparisonTable — Spec-Driven AI Development Comparison Matrix.
function ComparisonTable() {
  const cols = ['Buying question', 'GitHub Spec Kit', 'Kiro', 'GSD', 'Spec Kitty'];
  const rows = [
    ['Best fit',
      'Teams or developers that want an open-source spec-driven workflow baseline',
      'Developers and teams that want a structured spec-first IDE/CLI environment',
      'Developers who want a portable context and execution methodology',
      'Teams that need governed, observable, reviewable agentic coding'],
    ['Primary surface',
      'Specs, plans, tasks, templates, and agent integrations',
      'IDE, CLI, specs, hooks, steering, and agent features',
      'Prompts, context files, commands, and execution loops',
      <>CLI workflow, <code className="sk-code-inline">kitty-specs</code>, Teamspace, tracker sync, and Decision Moments</>],
    ['Team visibility',
      'Depends on how the team layers process around it',
      'Strong inside the Kiro workflow surface',
      'Mostly methodology and local workflow oriented',
      'Teamspace shows missions across canonical projects, builds, and checkouts'],
    ['Governance model',
      'Spec artifacts and process conventions',
      'Spec-first IDE workflow with project steering',
      'Context engineering discipline',
      'Charter, Doctrine, glossary, work packages, approvals, ADRs, and review'],
  ];
  return (
    <section className="sk-section">
      <div className="sk-container">
        <h2 className="sk-h2" style={{ marginBottom: 32 }}>Spec-Driven AI Development Comparison Matrix</h2>
        <div className="sk-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="sk-table">
            <thead>
              <tr>
                {cols.map((c, i) => {
                  const isLabelCol = i === 0;
                  const isFeatured = i === cols.length - 1;
                  return (
                    <th key={i}
                      className={isFeatured ? 'sk-table__featured-head' : ''}
                      style={{
                        padding: '20px 22px', textAlign: 'left',
                        color: isLabelCol ? 'var(--sk-fg-3)' : 'var(--sk-fg-0)',
                        fontWeight: 700,
                        fontFamily: isLabelCol ? 'var(--sk-font-mono)' : undefined,
                        fontSize: isLabelCol ? 12 : 14,
                        letterSpacing: isLabelCol ? 'var(--sk-tracking-eyebrow)' : undefined,
                        textTransform: isLabelCol ? 'uppercase' : 'none',
                        borderBottom: '1px solid var(--sk-border)',
                        background: isFeatured ? undefined : 'var(--sk-bg-1)',
                        width: isLabelCol ? 160 : 'auto',
                      }}>{c}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => {
                // Zebra rows — even rows use bg-2 (the card surface), odd rows step
                // up to bg-3. We expose the row's zebra color as a CSS var so the
                // featured-column tint can layer on top without losing the band.
                const zebra = ri % 2 === 1 ? 'var(--sk-bg-3)' : 'transparent';
                return (
                  <tr key={ri} style={{ background: zebra, '--row-zebra': zebra }}>
                    {r.map((cell, ci) => {
                      const isLabelCol = ci === 0;
                      const isFeatured = ci === r.length - 1;
                      return (
                        <td key={ci}
                          className={isFeatured ? 'sk-table__featured' : ''}
                          style={{
                            padding: '22px',
                            verticalAlign: 'top',
                            color: isLabelCol ? 'var(--sk-fg-0)' : 'var(--sk-fg-1)',
                            fontWeight: isLabelCol || isFeatured ? 600 : 400,
                            borderBottom: ri < rows.length - 1 ? '1px solid var(--sk-border)' : 'none',
                            borderRight: isLabelCol ? '1px solid var(--sk-border)' : 'none',
                            lineHeight: 1.55,
                          }}>{cell}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
window.SKComparisonTable = ComparisonTable;
