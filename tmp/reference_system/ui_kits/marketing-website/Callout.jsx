// Callout — two side-by-side cards each with icon chip, title, bullet list, footer copy.
const { IconNetwork, IconUsers } = window.SKIcons;

function CalloutCard({ icon: I, title, items, footer }) {
  return (
    <article className="sk-card">
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: 'rgba(245,197,24,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22
      }}>
        <I size={18} color="var(--sk-yellow)" />
      </div>
      <h3 className="sk-h4" style={{ marginBottom: 16 }}>{title}</h3>
      <ul className="sk-list" style={{ marginBottom: 18 }}>
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
      <p className="sk-muted" style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{footer}</p>
    </article>
  );
}

function Callout() {
  return (
    <section className="sk-section">
      <div className="sk-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <CalloutCard
          icon={IconNetwork}
          title="Why teams use it"
          items={[
            'Requirements and design decisions drift over long agent sessions.',
            'Parallel work is hard to coordinate across branches.',
            'Review and acceptance criteria become inconsistent from one feature to the next.',
          ]}
          footer="Spec Kitty addresses this with repository-native artifacts, work package workflows, and git worktree isolation."
        />
        <CalloutCard
          icon={IconUsers}
          title="Who it's for"
          items={[
            'Engineering teams using tools like Claude Code, Cursor, Codex, Gemini CLI, and Copilot.',
            'Tech leads who want predictable, auditable AI-assisted delivery.',
            'Projects where traceability from requirements to code matters.',
          ]}
          footer="Start here when you want to evaluate the CLI in a real repo before deciding how far to take the workflow."
        />
      </div>
    </section>
  );
}
window.SKCallout = Callout;
