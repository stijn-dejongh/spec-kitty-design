// CTABlock + Footer.
function CTABlock() {
  return (
    <section className="sk-section">
      <div className="sk-container">
        <article className="sk-card" style={{ padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <h2 className="sk-h3" style={{ fontSize: 32, marginBottom: 16, lineHeight: 1.2 }}>
              Spec Kitty: the missing layer between product planning and agentic delivery
            </h2>
            <p className="sk-muted" style={{ fontSize: 15, marginBottom: 28 }}>
              See how Spec Kitty fits your current planning systems, review process, and preferred coding tools.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a className="sk-btn sk-btn--primary" href="#">Book a Demo</a>
              <a className="sk-btn sk-btn--secondary" href="#">Getting Started</a>
            </div>
          </div>
          <div className="sk-card sk-card--inset">
            <h4 className="sk-h4" style={{ marginBottom: 18 }}>The difference Spec Kitty makes</h4>
            <ul className="sk-list sk-list--check">
              <li>Specs accepted before implementation fans out</li>
              <li>Work packages completed across visible lanes</li>
              <li>Reviews passed against the spec instead of only against code</li>
              <li>Decisions and rationale captured instead of lost in meetings</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: '64px 0 40px', borderTop: '1px solid var(--sk-border)' }}>
      <div className="sk-container" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <img src="../../assets/logo.png" alt="" width="28" height="28" />
            <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--sk-fg-0)' }}>Spec Kitty</span>
          </div>
          <p className="sk-muted" style={{ fontSize: 14, maxWidth: 360, margin: 0 }}>
            The missing workflow layer that keeps AI coding aligned with product
            intent. Built for product and engineering teams that ship with confidence.
          </p>
        </div>
        <div>
          <div className="sk-eyebrow" style={{ marginBottom: 18 }}>Product</div>
          {['Platform', 'Getting Started', 'About', 'Blog', 'Docs'].map(x =>
            <div key={x} style={{ marginBottom: 12 }}>
              <a href="#" className="sk-footer-link">{x}</a>
            </div>
          )}
        </div>
        <div>
          <div className="sk-eyebrow" style={{ marginBottom: 18 }}>Connect</div>
          {['Training', 'Contact', 'GitHub', 'LinkedIn'].map(x =>
            <div key={x} style={{ marginBottom: 12 }}>
              <a href="#" className="sk-footer-link">{x}</a>
            </div>
          )}
        </div>
      </div>
      <hr className="sk-divider" />
      <div className="sk-container">
        <p className="sk-small" style={{ margin: 0 }}>© 2026 Spec Kitty. All rights reserved.</p>
      </div>
    </footer>
  );
}

window.SKCTABlock = CTABlock;
window.SKFooter = Footer;
