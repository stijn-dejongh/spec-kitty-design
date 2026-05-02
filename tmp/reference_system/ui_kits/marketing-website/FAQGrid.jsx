// FAQGrid — section heading + 3-up FAQ cards.
function FAQ({ q, a }) {
  return (
    <article className="sk-card">
      <h4 className="sk-h4" style={{ marginBottom: 14, lineHeight: 1.3 }}>{q}</h4>
      <p className="sk-muted" style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{a}</p>
    </article>
  );
}

function FAQGrid() {
  const faqs = [
    {
      q: 'Do we need to replace our developers or delivery process to use Spec Kitty?',
      a: 'No. Spec Kitty is designed for software organizations that already have developers, planning systems, review habits, and engineering standards. It adds a workflow layer for agentic coding without asking teams to throw away the process they already trust.'
    },
    {
      q: 'Why review the spec before generated code?',
      a: 'Reviewing the spec is the better control point. When teams align on the spec, acceptance criteria, and constraints in natural language first, review gets easier, rework drops, and generated code is much less likely to drift from intent.'
    },
    {
      q: 'Does everyone need to use the same AI coding tool?',
      a: 'No. Spec Kitty standardizes the workflow layer: specs, plans, work packages, review, and acceptance. Teams can keep their preferred coding tools while still working inside one consistent operating model.'
    }
  ];
  return (
    <section className="sk-section">
      <div className="sk-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 40 }}>
          <span aria-hidden="true" style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'rgba(245,197,24,0.10)',
            border: '1px solid rgba(245,197,24,0.35)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--sk-yellow)',
            fontFamily: 'var(--sk-font-display)',
            fontWeight: 800,
            fontSize: 32,
            lineHeight: 1,
            flexShrink: 0,
          }}>?</span>
          <h2 className="sk-h2" style={{ margin: 0 }}>Frequently asked questions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {faqs.map((f, i) => <FAQ key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
}
window.SKFAQGrid = FAQGrid;
