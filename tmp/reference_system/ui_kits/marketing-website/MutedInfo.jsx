// MutedInfo — small banner-style "Open-source CLI quickstart" hero variant.
function MutedInfo() {
  return (
    <section className="sk-section sk-section--tight">
      <div className="sk-container">
        <span className="sk-eyebrow-pill" style={{ marginBottom: 24 }}>Open-source CLI quickstart</span>
        <h2 className="sk-h1" style={{ fontSize: 56, margin: '20px 0 24px' }}>Getting started with Spec Kitty</h2>
        <p className="sk-lead" style={{ maxWidth: 720, marginBottom: 16 }}>
          Spec Kitty is an open-source CLI workflow for spec-driven development with
          AI coding agents. It helps teams turn product intent into implementation
          with a repeatable path: <strong>spec</strong> -&gt; <strong>plan</strong> -&gt; <strong>tasks</strong> -&gt; <strong>implement</strong> -&gt; <strong>review</strong> -&gt; <strong>merge</strong>.
        </p>
        <p className="sk-lead" style={{ maxWidth: 720, marginBottom: 32 }}>
          The fastest way to evaluate it is to install the CLI, initialize a real
          project, and open your preferred coding agent in that directory.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <a className="sk-btn sk-btn--primary" href="#">View on GitHub</a>
          <a className="sk-btn sk-btn--secondary" href="#">Read the Docs</a>
          <a className="sk-btn sk-btn--ghost" href="#">Book a Demo</a>
        </div>
      </div>
    </section>
  );
}
window.SKMutedInfo = MutedInfo;
