/* @spec-kitty/html-js — sk-nav-pill toggle behaviour */

/**
 * Toggle the nav drawer open/closed.
 * Call from the hamburger button's onclick handler.
 * @param {HTMLElement} btn - the hamburger button element
 */
export function skToggleDrawer(btn) {
  const drawer = document.getElementById('sk-nav-drawer');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  btn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
}
