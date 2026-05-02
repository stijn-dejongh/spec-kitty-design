// Hero — eyebrow pill, big headline, lead, checkmark bullets, CTAs, mascot.
const { IconArrowRight, IconGitHub } = window.SKIcons;

function Hero() {
  return (
    <section className="sk-section">
      <div className="sk-container" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'center' }}>
        <div>
          <span className="sk-eyebrow-pill" style={{ marginBottom: 32 }}>For software teams adopting agentic coding</span>
          <h1 className="sk-h1" style={{ marginTop: 24, marginBottom: 24 }}>Bring Structure to <br/>AI-assisted delivery</h1>
          <p className="sk-lead" style={{ maxWidth: 560, marginBottom: 28 }}>
            Spec Kitty turns rough requests into reviewable specs, plans, and work
            packages before code generation begins. It helps software teams use Claude
            Code, Cursor, Codex, Gemini, and similar tools inside the delivery process
            they already trust.
          </p>
          <ul className="sk-list sk-list--check" style={{ marginBottom: 36, maxWidth: 560 }}>
            <li>Developers spend time building, not being blocked on finalized requirements.</li>
            <li>Works with Jira, Linear, GitHub, GitLab, and Slack to keep your team coordinated.</li>
            <li>Specs, requirements, and work packages stay current before agents start shipping.</li>
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="#" className="sk-btn sk-btn--primary">Get Started <IconArrowRight size={16} /></a>
            <a href="#" className="sk-btn sk-btn--secondary">Star on GitHub <IconGitHub size={16} /></a>
            <a href="#" className="sk-btn sk-btn--ghost">Read the docs</a>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          {/* Mascot placeholder: real artwork is hand-drawn watercolor.
              We use the small logo here at large scale as a stand-in. */}
          <img src="../../assets/logo.png" alt="Spec Kitty mascot"
            width="320" height="320"
            style={{ filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.5))' }}/>
        </div>
      </div>
    </section>
  );
}

window.SKHero = Hero;
