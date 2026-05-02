// ========================================================
// Spec Kitty — Lucide-style icon set (subset, inline SVG)
// 2px stroke, rounded line caps, 24×24 viewBox.
// ⚠️ If lucide-react is available in production, prefer that.
// ========================================================
const Icon = ({ children, size = 20, color = 'currentColor', stroke = 2, style }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={color} strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round"
    style={style}
  >{children}</svg>
);

const IconClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></Icon>;
const IconDoc = (p) => <Icon {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/></Icon>;
const IconUsers = (p) => <Icon {...p}><path d="M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 19v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
const IconLink = (p) => <Icon {...p}><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></Icon>;
const IconArrowRight = (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon>;
const IconMoon = (p) => <Icon {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Icon>;
const IconSun = (p) => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></Icon>;
const IconGitHub = (p) => <Icon {...p}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></Icon>;
const IconChevronDown = (p) => <Icon {...p}><polyline points="6 9 12 15 18 9"/></Icon>;
const IconChevronRight = (p) => <Icon {...p}><polyline points="9 6 15 12 9 18"/></Icon>;
const IconNetwork = (p) => <Icon {...p}><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M9 6h3a3 3 0 0 1 3 3v3"/></Icon>;
const IconCheck = (p) => <Icon {...p}><polyline points="4 12 10 18 20 6"/></Icon>;
const IconClose = (p) => <Icon {...p}><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></Icon>;

window.SKIcons = {
  Icon, IconClock, IconDoc, IconUsers, IconLink, IconArrowRight,
  IconMoon, IconSun, IconGitHub, IconChevronDown, IconChevronRight,
  IconNetwork, IconCheck, IconClose
};
