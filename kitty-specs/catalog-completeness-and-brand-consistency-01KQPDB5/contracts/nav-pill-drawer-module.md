# Contract: `skToggleDrawer` JS module export

**Mission**: `catalog-completeness-and-brand-consistency-01KQPDB5`
**Sources**: spec FR-010, FR-011, NFR-007; research PLAN-003

This contract is the agreement that any implementation of the nav-pill drawer JS module must satisfy. It is binding on both the html-js package and the Storybook story decorator that exercises it.

## Module location and exports

- File: `packages/html-js/src/nav-pill/sk-nav-pill.js`
- Type: ES module
- Public exports: exactly one — the named export `skToggleDrawer`

```ts
// sk-nav-pill.d.ts
export function skToggleDrawer(buttonElement: HTMLElement | null): boolean;
```

`packages/html-js/src/nav-pill/index.ts` re-exports the module and the two CSS files:

```ts
export { skToggleDrawer } from './sk-nav-pill.js';
import './sk-nav-pill.css';            // basic pill (always required if using nav-pill)
// Drawer CSS is opt-in — consumers import './sk-nav-pill-drawer.css' separately.
```

## `skToggleDrawer` function contract

### Signature

```js
/**
 * Toggle the nav-pill drawer open/closed and synchronize the hamburger
 * button's ARIA state.
 *
 * @param {HTMLElement | null} buttonElement
 *   The hamburger button. Its associated drawer MUST be the element
 *   with id="sk-nav-drawer" present in the same document.
 * @returns {boolean}
 *   The new open state — true if the drawer is now open after the toggle,
 *   false if it is now closed (or if the call no-op'd).
 */
export function skToggleDrawer(buttonElement)
```

### Behaviour

| Input condition | Effect | Return value |
|---|---|---|
| `buttonElement` is `null` or `undefined` | No-op; no exception thrown | `false` |
| `buttonElement` is a valid element BUT no `#sk-nav-drawer` exists in the document | No-op; no exception thrown | `false` |
| `buttonElement` valid AND drawer exists AND drawer is currently closed | Add class `is-open` to the drawer; set `buttonElement.aria-expanded="true"`; set `buttonElement.aria-label="Close navigation"` | `true` |
| `buttonElement` valid AND drawer exists AND drawer is currently open | Remove class `is-open` from the drawer; set `buttonElement.aria-expanded="false"`; set `buttonElement.aria-label="Open navigation"` | `false` |

### Invariants

1. **Pure side effects**: the function makes only the DOM mutations listed above. It does NOT add or remove other classes, does NOT mutate other attributes, does NOT call `focus()`, does NOT add or remove event listeners, does NOT publish events.
2. **Idempotent w.r.t. nullary calls**: calling with `null` repeatedly is safe.
3. **No global state**: the function reads the current open state from the drawer element on every call. There is no module-level cache.
4. **No async**: the function is synchronous and returns synchronously.
5. **No throws on the documented failure modes**: missing button or missing drawer return `false` rather than throwing.

### Consumer-side contract

The consumer must:

- Render an element with `id="sk-nav-drawer"` that contains the drawer markup.
- Render a hamburger button (typically `<button class="sk-nav-pill__hamburger">`).
- Wire the button to invoke `skToggleDrawer(buttonElement)` on `click` — either via an inline `onclick="skToggleDrawer(this)"` (after attaching the imported function to `window.skToggleDrawer`), OR via `addEventListener` (preferred). The package README MUST document both patterns.

The consumer must NOT need to:

- Copy any script from `apps/demo/dashboard-demo.html` (FR-010).
- Implement their own ARIA-state synchronization.
- Pre-process or wrap the drawer element.

## Storybook integration contract (FR-011)

The `CollapsedHamburger` story in `packages/html-js/src/nav-pill/sk-nav-pill.stories.ts` MUST:

- Import `skToggleDrawer` from the local module.
- Use a story `decorators` entry that assigns `window.skToggleDrawer = skToggleDrawer` BEFORE the story's HTML is rendered, so the inline `onclick="skToggleDrawer(this)"` resolves at click time.
- Render the drawer markup (basic pill + drawer + button) so the toggle is interactive in Storybook.
- Document in `parameters.docs.description.story` that the consumer must import both `sk-nav-pill.css` AND `sk-nav-pill-drawer.css` to use the collapsed/drawer pattern.
- Pass axe-core's a11y checks (`aria-expanded`, button focusability, drawer focus management).

## Failure modes that the contract explicitly prevents

- **Brittle copy-paste**: consumer adopts the pattern by reading the demo HTML, copies the inline script, and the script silently breaks when the demo's drawer ID changes. Prevented by FR-010 ("import from package only") and the documented `id="sk-nav-drawer"` contract.
- **Storybook drift**: the `CollapsedHamburger` story renders but the drawer doesn't toggle when clicked, leaving reviewers unable to verify the interaction. Prevented by FR-011 (explicit "must be interactive in Storybook").
- **ARIA drift**: a maintainer changes the open/close state via class manipulation but forgets to update `aria-expanded`, breaking screen-reader UX. Prevented by the function being the single integration point for both class and ARIA state.
