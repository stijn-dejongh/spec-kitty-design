// BlogIndex — featured entry (full-width 3x1) + 3-up grid below.
//
// The "image" tiles are illustrative SVG scenes built from the brand palette.
// They sit where photography would in a production site; swap them for real
// hand-drawn watercolor art (per the brand) once that's in hand.

function BlogTile({ scene, height = 200 }) {
  // Each scene is a distinct compositional motif so cards are
  // visually identifiable at a glance, not just colored slabs.
  const scenes = {
    matrix: (
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <defs>
          <linearGradient id="bgmx" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#2A3D4F"/>
            <stop offset="1" stopColor="#16222D"/>
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#bgmx)"/>
        {/* Comparison-grid motif */}
        <g stroke="#A9C7E8" strokeWidth="1.2" fill="none" opacity="0.55">
          {[0,1,2,3].map(i => <line key={'h'+i} x1="40" x2="360" y1={50+i*30} y2={50+i*30}/>)}
          {[0,1,2,3,4].map(i => <line key={'v'+i} x1={60+i*60} x2={60+i*60} y1="40" y2="160"/>)}
        </g>
        {/* Highlighted column = Spec Kitty */}
        <rect x="240" y="40" width="60" height="120" fill="#F5C518" opacity="0.18"/>
        <rect x="240" y="40" width="60" height="120" stroke="#F5C518" strokeWidth="1.5" fill="none"/>
        {/* Cells with check/dash glyphs */}
        <g stroke="#FFF" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M76 75 l6 6 l12 -14"/>
          <path d="M136 75 l6 6 l12 -14"/>
          <path d="M196 75 l6 6 l12 -14"/>
          <path d="M256 75 l6 6 l12 -14"/>
          <path d="M76 105 l16 0"/>
          <path d="M136 105 l6 6 l12 -14"/>
          <path d="M256 105 l6 6 l12 -14"/>
        </g>
      </svg>
    ),
    legacy: (
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <defs>
          <linearGradient id="bglg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3A2A1A"/>
            <stop offset="1" stopColor="#1C1308"/>
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#bglg)"/>
        {/* Stacked code-block motif suggesting legacy systems */}
        <g fill="#8B7355" opacity="0.7">
          <rect x="40" y="50" width="120" height="14" rx="2"/>
          <rect x="40" y="72" width="180" height="14" rx="2"/>
          <rect x="40" y="94" width="100" height="14" rx="2"/>
          <rect x="40" y="116" width="160" height="14" rx="2"/>
          <rect x="40" y="138" width="80" height="14" rx="2"/>
        </g>
        {/* Modernization arrow + new block */}
        <path d="M240 100 l30 0 m-8 -8 l8 8 l-8 8" stroke="#F5C518" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <g fill="#F5C518">
          <rect x="290" y="60" width="80" height="10" rx="2" opacity="0.95"/>
          <rect x="290" y="80" width="60" height="10" rx="2" opacity="0.7"/>
          <rect x="290" y="100" width="70" height="10" rx="2" opacity="0.55"/>
          <rect x="290" y="120" width="50" height="10" rx="2" opacity="0.4"/>
        </g>
      </svg>
    ),
    founder: (
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <defs>
          <linearGradient id="bgfd" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#D4A973"/>
            <stop offset="1" stopColor="#5A8AA8"/>
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#bgfd)"/>
        {/* Sun + horizon */}
        <circle cx="120" cy="80" r="40" fill="#F5C518" opacity="0.85"/>
        <path d="M0 140 Q 100 120, 200 140 T 400 140 L 400 200 L 0 200 Z" fill="#2A2A22" opacity="0.4"/>
        {/* Mascot silhouette */}
        <g transform="translate(260 70)" opacity="0.92">
          <circle cx="40" cy="50" r="42" fill="#FFFFFF"/>
          <path d="M8 30 L14 4 L26 22 Z" fill="#FFFFFF"/>
          <path d="M72 30 L66 4 L54 22 Z" fill="#FFFFFF"/>
          <circle cx="30" cy="48" r="8" fill="#2A2A22"/>
          <circle cx="50" cy="48" r="8" fill="#2A2A22"/>
        </g>
      </svg>
    ),
    featured: (
      <svg viewBox="0 0 1200 360" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <defs>
          <linearGradient id="bgft" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#2A2A1F"/>
            <stop offset="0.55" stopColor="#3F3826"/>
            <stop offset="1" stopColor="#1A1812"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="360" fill="url(#bgft)"/>
        {/* Spec → plan → build flow diagram */}
        <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#FAF8F2" opacity="0.85" letterSpacing="0.14em">
          <text x="180" y="118" textAnchor="middle">SPEC</text>
          <text x="540" y="118" textAnchor="middle">PLAN</text>
          <text x="900" y="118" textAnchor="middle">WORK PACKAGE</text>
        </g>
        {/* Three nodes */}
        <g>
          <rect x="100" y="140" width="160" height="100" rx="12" fill="#FAF8F2" opacity="0.08" stroke="#FAF8F2" strokeOpacity="0.3"/>
          <rect x="460" y="140" width="160" height="100" rx="12" fill="#F5C518" opacity="0.18" stroke="#F5C518" strokeOpacity="0.65"/>
          <rect x="820" y="140" width="160" height="100" rx="12" fill="#FAF8F2" opacity="0.08" stroke="#FAF8F2" strokeOpacity="0.3"/>
        </g>
        {/* Inner content lines */}
        <g fill="#FAF8F2" opacity="0.4">
          <rect x="120" y="160" width="100" height="6" rx="1"/>
          <rect x="120" y="172" width="80"  height="6" rx="1"/>
          <rect x="120" y="184" width="120" height="6" rx="1"/>
          <rect x="120" y="196" width="60"  height="6" rx="1"/>
        </g>
        <g fill="#F5C518" opacity="0.7">
          <rect x="480" y="160" width="100" height="6" rx="1"/>
          <rect x="480" y="172" width="120" height="6" rx="1"/>
          <rect x="480" y="184" width="80"  height="6" rx="1"/>
          <rect x="480" y="196" width="100" height="6" rx="1"/>
        </g>
        <g fill="#FAF8F2" opacity="0.4">
          <rect x="840" y="160" width="80"  height="6" rx="1"/>
          <rect x="840" y="172" width="120" height="6" rx="1"/>
          <rect x="840" y="184" width="100" height="6" rx="1"/>
          <rect x="840" y="196" width="60"  height="6" rx="1"/>
        </g>
        {/* Arrows */}
        <g stroke="#F5C518" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
          <path d="M260 190 L 460 190 m-10 -8 l10 8 l-10 8"/>
          <path d="M620 190 L 820 190 m-10 -8 l10 8 l-10 8"/>
        </g>
        {/* Cat watermark, subtle */}
        <g transform="translate(1020 60)" opacity="0.18">
          <circle cx="60" cy="60" r="50" fill="#FAF8F2"/>
        </g>
      </svg>
    ),
  };
  return (
    <div style={{ height, position: 'relative', overflow: 'hidden' }}>
      {scenes[scene]}
    </div>
  );
}

// Standard 1/3 card
function BlogCard({ tag, date, title, lead, scene }) {
  return (
    <article className="sk-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <BlogTile scene={scene} height={200} />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="sk-eyebrow-pill" style={{ fontSize: 12, padding: '4px 12px' }}>{tag}</span>
          <span className="sk-mono" style={{ color: 'var(--sk-fg-3)', fontSize: 13 }}>{date}</span>
        </div>
        <h3 className="sk-h4" style={{ margin: 0, lineHeight: 1.3 }}>{title}</h3>
        <p className="sk-muted" style={{ fontSize: 14, lineHeight: 1.6, margin: 0, flex: 1 }}>{lead}</p>
        <a href="#" style={{ fontWeight: 700, fontSize: 14, color: 'var(--sk-fg-0)' }}>Read the post</a>
      </div>
    </article>
  );
}

// Featured 3x1 — image + content side-by-side
function BlogFeatured({ tag, date, title, lead, scene }) {
  return (
    <article className="sk-card" style={{
      padding: 0, overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '1.15fr 1fr',
      gridColumn: '1 / -1',
      borderColor: 'rgba(245,197,24,0.30)',
    }}>
      <BlogTile scene={scene} height={360} />
      <div style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="sk-tag sk-tag--yellow" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '4px 10px' }}>Featured</span>
          <span className="sk-eyebrow-pill" style={{ fontSize: 12, padding: '4px 12px' }}>{tag}</span>
          <span className="sk-mono" style={{ color: 'var(--sk-fg-3)', fontSize: 13, marginLeft: 'auto' }}>{date}</span>
        </div>
        <h3 className="sk-h2" style={{ margin: 0, lineHeight: 1.2, fontSize: 32 }}>{title}</h3>
        <p className="sk-muted" style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{lead}</p>
        <a href="#" style={{ fontWeight: 700, fontSize: 14, color: 'var(--sk-yellow)' }}>Read the post →</a>
      </div>
    </article>
  );
}

function BlogIndex() {
  return (
    <section className="sk-section">
      <div className="sk-container">
        <h2 className="sk-h2" style={{ marginBottom: 8 }}>Blog</h2>
        <p className="sk-muted" style={{ marginBottom: 40 }}>Notes on spec workflow, agentic coding, and collaboration patterns.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <BlogFeatured
            tag="Workflow" date="2026-05-01"
            title="The Operating Model for Agentic Software Teams"
            lead="How spec, plan, and work-package layers turn rough requests into reviewable, traceable units of work — and why that matters more than the model under the hood."
            scene="featured"
          />
          <BlogCard
            tag="Competitive matrix" date="2026-04-30"
            title="Spec Kitty vs GitHub Spec Kit vs AWS Kiro vs GSD"
            lead="A corrected competitive matrix for teams comparing spec-driven AI development tools, positioned around governance, Teamspace, tracker sync, and project memory."
            scene="matrix"
          />
          <BlogCard
            tag="Legacy migration" date="2026-04-29"
            title="AI Legacy Code Modernization in 2026"
            lead="A legacy modernization matrix for teams comparing deterministic recipe engines, AWS modernization paths, coding assistants, and Spec Kitty governance."
            scene="legacy"
          />
          <BlogCard
            tag="Founder note" date="2026-04-27"
            title="Why I Built Spec Kitty"
            lead="Why agentic coding needs more than prompts: intent, memory, governance, and fresh-context review for serious software teams."
            scene="founder"
          />
        </div>
      </div>
    </section>
  );
}
window.SKBlogIndex = BlogIndex;
window.SKBlogCard = BlogCard;
window.SKBlogFeatured = BlogFeatured;
