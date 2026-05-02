// PricingCard — workshop highlight card with PRIMARY WORKSHOP ribbon.
function PricingCard() {
  return (
    <section className="sk-section">
      <div className="sk-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Highlighted card */}
        <article className="sk-card" style={{ position: 'relative', borderColor: 'rgba(245,197,24,0.4)' }}>
          <div style={{
            position: 'absolute', top: 0, right: 32,
            background: 'var(--sk-yellow)', color: 'var(--sk-accent-fg)',
            fontFamily: 'var(--sk-font-mono)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            padding: '6px 14px', borderRadius: '0 0 6px 6px',
          }}>Primary Workshop</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start', marginTop: 12 }}>
            <div>
              <h3 className="sk-h3" style={{ marginBottom: 12 }}>Full-day rollout workshop</h3>
              <p className="sk-muted" style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                A focused remote session to get product, engineering, and reviewers
                aligned on how Spec Kitty should work in your environment. Includes
                a quarterly checkin as followup to ensure your success.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--sk-font-display)', fontWeight: 800,
                fontSize: 56, color: 'var(--sk-fg-0)', lineHeight: 1
              }}>$3,450</div>
              <div className="sk-muted" style={{ fontSize: 13, marginTop: 4 }}>/ day</div>
            </div>
          </div>
          <hr className="sk-divider" />
          <div className="sk-eyebrow">What the team leaves with</div>
        </article>

        {/* Outcomes card */}
        <article className="sk-card">
          <h3 className="sk-h4" style={{ marginBottom: 14 }}>Concrete outcomes from the workshop</h3>
          <p className="sk-muted" style={{ fontSize: 14, lineHeight: 1.65, margin: '0 0 16px' }}>
            Teams leave with more than alignment. They leave with shared language,
            clearer role boundaries, and a practical operating cadence for reviewing
            specs, running work packages, and accepting work against defined
            requirements.
          </p>
          <p className="sk-muted" style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>
            The workshop is also designed to produce real delivery progress. Teams
            often work through an actual backlog item together, and it has been
            common to complete items that had previously been estimated as five- to
            ten-day efforts during the training itself.
          </p>
        </article>
      </div>
    </section>
  );
}
window.SKPricingCard = PricingCard;
