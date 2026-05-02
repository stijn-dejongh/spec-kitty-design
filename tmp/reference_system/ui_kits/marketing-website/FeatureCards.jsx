// FeatureCards — 3-up row with tinted icon chip, title, body.
const { IconClock, IconDoc, IconUsers } = window.SKIcons;

const FEATURES = [
  {
    icon: IconClock, accent: 'yellow',
    title: 'Stay in flow, not in alignment meetings',
    body: "When requirements are scattered across meetings, tickets, chat, and people's heads, engineers keep getting pulled back into alignment instead of building. Spec Kitty turns rough requests into shared specs, plans, and work packages that product and engineering can review asynchronously."
  },
  {
    icon: IconDoc, accent: 'green',
    title: 'Context stays where your team can find it',
    body: 'Teams lose crucial context in chat threads, scattered docs, and half-remembered decisions. Spec Kitty keeps decisions, alternatives, rationale, research, work package history, and accepted outcomes attached to the feature itself.'
  },
  {
    icon: IconUsers, accent: 'purple',
    title: 'Your team picks the AI tool',
    body: 'Teams rarely use a single AI coding tool, and workflow discipline breaks down when everyone works differently. Spec Kitty standardizes workflow state, review, lane transitions, acceptance, and guardrails across the tools your team already uses.'
  },
];

const CHIP_BG = {
  yellow: 'rgba(245,197,24,0.10)', green: 'rgba(143,203,143,0.12)', purple: 'rgba(184,169,224,0.12)'
};
const CHIP_FG = {
  yellow: 'var(--sk-yellow)', green: 'var(--sk-green)', purple: 'var(--sk-purple)'
};

function FeatureCards() {
  return (
    <section className="sk-section" style={{ background: 'var(--sk-bg-1)' }}>
      <div className="sk-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {FEATURES.map((f, i) => {
          const I = f.icon;
          return (
            <article key={i} className="sk-card" style={{ background: 'var(--sk-bg-2)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: CHIP_BG[f.accent],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 22,
              }}>
                <I size={20} color={CHIP_FG[f.accent]} />
              </div>
              <h3 className="sk-h4" style={{ marginBottom: 12 }}>{f.title}</h3>
              <p className="sk-muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{f.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
window.SKFeatureCards = FeatureCards;
