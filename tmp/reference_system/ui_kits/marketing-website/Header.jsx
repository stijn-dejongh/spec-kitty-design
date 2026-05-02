// Header — top nav with logo, pill nav, theme toggle, GitHub pill, Book Demo CTA.
const { IconMoon, IconSun, IconGitHub } = window.SKIcons;

function Header({ active = 'Platform', onTheme, theme = 'dark' }) {
  const items = ['Platform', 'Getting Started', 'About', 'Blog', 'Training'];
  return (
    <header style={{ padding: '20px 0', borderBottom: '1px solid var(--sk-border)' }}>
      <div className="sk-container" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--sk-fg-0)', textDecoration: 'none' }}>
          <img src="../../assets/logo.png" alt="" width="36" height="36" />
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--sk-fg-0)' }}>Spec Kitty</span>
        </a>

        {/* Pill nav — active pill uses the yellow accent so it actually reads as 'current' */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 24 }}>
          {items.map(item => {
            const isActive = item === active;
            return (
              <a key={item} href="#"
                className={`sk-nav-link${isActive ? ' is-active' : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  fontSize: 14,
                  color: isActive ? 'var(--sk-accent-fg)' : 'var(--sk-fg-2)',
                  background: isActive ? 'var(--sk-yellow)' : 'transparent',
                  border: isActive ? '1px solid var(--sk-yellow)' : '1px solid transparent',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  boxShadow: isActive ? 'var(--sk-shadow-glow-yellow)' : 'none',
                }}>
                {item}
              </a>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Right cluster */}
        {/* Theme toggle: show the icon for the TARGET mode so the button reads as
            "switch to X". In dark mode → show sun (= go light). */}
        <button onClick={onTheme} aria-label="Toggle theme"
          className="sk-icon-btn"
          style={{
            width: 38, height: 38, borderRadius: 999,
            background: 'var(--sk-bg-pill)', border: '1px solid var(--sk-border-strong)',
            color: 'var(--sk-fg-1)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
          {theme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
        </button>
        <a href="#"
          className="sk-icon-btn"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 16px', borderRadius: 999,
            background: 'var(--sk-bg-pill)', border: '1px solid var(--sk-border-strong)',
            color: 'var(--sk-fg-1)', fontSize: 14, fontWeight: 600,
          }}>
          GitHub <IconGitHub size={14} />
        </a>
        <a href="#" className="sk-btn sk-btn--primary sk-btn--sm">Book Demo</a>
      </div>
    </header>
  );
}

window.SKHeader = Header;
