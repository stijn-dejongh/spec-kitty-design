// Timeline — changelog-style timeline with section banners and version cards.
function TimelineEntry({ version, date, title, body, tags = [], highlighted, accent = 'yellow' }) {
  const dotColor = { yellow: '#F5C518', purple: '#B8A9E0', green: '#8FCB8F' }[accent];
  // Per-accent colors for the version tag — mirrors the section banner.
  const accentBg = { yellow: 'rgba(245,197,24,0.12)', purple: 'rgba(184,169,224,0.14)', green: 'rgba(143,203,143,0.12)' }[accent];
  const accentBd = { yellow: 'rgba(245,197,24,0.40)', purple: 'rgba(184,169,224,0.40)', green: 'rgba(143,203,143,0.35)' }[accent];
  const accentFg = { yellow: 'var(--sk-yellow)', purple: 'var(--sk-purple)', green: 'var(--sk-green)' }[accent];
  return (
    <div style={{ position: 'relative', paddingLeft: 50, paddingBottom: 32 }}>
      {/* Vertical rail */}
      <div style={{ position: 'absolute', left: 14, top: 0, bottom: 0, width: 1, background: 'var(--sk-border)' }} />
      {/* Dot */}
      <div style={{
        position: 'absolute', left: 7, top: 22, width: 16, height: 16,
        borderRadius: '50%', background: 'var(--sk-bg-0)',
        border: `2px solid ${dotColor}`,
      }} />
      <article className="sk-card" style={{
        padding: '20px 24px',
        // Uniform 1px border on all sides; left side gets the thicker accent
        // (3px) when highlighted so emphasis lives on a single edge.
        border: '1px solid var(--sk-border-strong)',
        borderLeft: highlighted ? `3px solid ${dotColor}` : '1px solid var(--sk-border-strong)',
      }}>
        {/* Header row: title left, version tag + date right, all on one baseline */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: body ? 8 : 0 }}>
          <h4 className="sk-h4" style={{ margin: 0, flex: 1 }}>{title}</h4>
          <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            background: accentBg,
            border: `1px solid ${accentBd}`,
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'var(--sk-font-mono)',
            color: accentFg,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>{version}</span>
          <span className="sk-mono" style={{ color: 'var(--sk-fg-3)', fontSize: 13, whiteSpace: 'nowrap' }}>{date}</span>
        </div>
        {body && <p className="sk-muted" style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{body}</p>}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {tags.map((t, i) => <span key={i} className={`sk-tag ${t.cls || ''}`}>{t.label}</span>)}
          </div>
        )}
      </article>
    </div>
  );
}

function TimelineSectionBanner({ accent, label }) {
  const bg = { yellow: 'rgba(245,197,24,0.08)', purple: 'rgba(184,169,224,0.10)', green: 'rgba(143,203,143,0.08)' }[accent];
  const fg = { yellow: 'var(--sk-yellow)', purple: 'var(--sk-purple)', green: 'var(--sk-green)' }[accent];
  return (
    <div style={{
      background: bg,
      border: '1px solid ' + bg,
      borderRadius: 8,
      padding: '14px 20px',
      marginBottom: 28,
      display: 'flex', alignItems: 'center', gap: 12,
      fontFamily: 'var(--sk-font-mono)', fontSize: 12,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: fg
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: fg }} />
      {label}
    </div>
  );
}

function Changelog() {
  return (
    <section className="sk-section">
      <div className="sk-container">
        <TimelineSectionBanner accent="yellow" label="Version 1.x — First Stable PyPI Release" />
        <TimelineEntry
          version="v1.0.0" date="Feb 24, 2026"
          title="First Stable Release — Promoted from v0.16.2"
          body="The culmination of 16 pre-release cycles. Spec Kitty graduates to a stable PyPI package with a clear contract boundary: the bundled orchestrator is gone."
          tags={[{ label: 'Breaking', cls: 'sk-tag--breaking' }, { label: 'Orchestrator Removed', cls: 'sk-tag--green' }, { label: 'Orchestrator API', cls: 'sk-tag--green' }]}
          highlighted accent="yellow"
        />
        <TimelineEntry version="v1.0.1" date="Feb 27" title="Dependency Floor Hardening" body="Explicit lower bounds for typer, rich, httpx, platformdirs, and readchar. Release validation robustness for version tags and branch parity." accent="yellow"/>
        <TimelineEntry version="v1.0.2" date="Mar 4" title="MIT-Cleared Dependency Pins" body={<><code className="sk-code-inline">spec-kitty-events==0.4.1</code> stabilized. Release train compatibility matrix added for downstream packages.</>} accent="yellow"/>

        <div style={{ height: 24 }} />
        <TimelineSectionBanner accent="purple" label="Version 2.x — Event Architecture & Skills" />
        <TimelineEntry
          version="v2.0.0" date="Feb 22, 2026"
          title="Parallel Development Track — GitHub-Only Releases"
          body="A parallel 2.x branch for SaaS features, running alongside 1.x on PyPI. Semantic versioning adoption and deterministic runtime mission template selection."
          tags={[{ label: 'SemVer', cls: 'sk-tag--green' }, { label: 'Runtime Templates', cls: 'sk-tag--green' }]}
          highlighted accent="purple"
        />
        <TimelineEntry version="v2.1.0" date="Mar 21" title="Promoted to Stable Main — Replaces 1.x"
          body="The 2.x line becomes the primary release. 6 canonical bundled skills with registry/installer/verification."
          tags={[{ label: '6 Skills', cls: 'sk-tag--green' }, { label: 'Stable Main', cls: 'sk-tag--green' }]} accent="purple"/>
      </div>
    </section>
  );
}
window.SKChangelog = Changelog;
window.SKTimelineEntry = TimelineEntry;
window.SKTimelineSectionBanner = TimelineSectionBanner;
