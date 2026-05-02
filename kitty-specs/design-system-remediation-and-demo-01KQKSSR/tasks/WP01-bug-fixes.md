---
work_package_id: WP01
title: Bug Fixes — Angular Buttons + html-js CSS Imports
dependencies: []
requirement_refs:
- FR-119
- FR-201
- FR-202
- FR-203
- FR-212
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-design-system-remediation-and-demo-01KQKSSR
base_commit: 08d7003d884898135b0933572df6dfa0a90d6be7
created_at: '2026-05-02T07:45:49.144607+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
- T007
- T008
agent: claude
shell_pid: '1979642'
history:
- date: '2026-05-02'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/angular/src/lib/button/
execution_mode: code_change
owned_files:
- packages/angular/src/lib/button/sk-button-primary.component.ts
- packages/angular/src/lib/button/sk-button-secondary.component.ts
- packages/angular/src/lib/button/sk-button-ghost.component.ts
- packages/html-js/src/check-bullet/sk-check-bullet-html.stories.ts
- packages/html-js/src/feature-card/sk-feature-card-html.stories.ts
- packages/html-js/src/form-field/sk-form-field-html.stories.ts
- packages/html-js/src/ribbon-card/sk-ribbon-card-html.stories.ts
- packages/html-js/src/section-banner/sk-section-banner-html.stories.ts
- packages/html-js/src/button/sk-button-html.stories.ts
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Fix three shipping bugs identified in the post-merge mission review (issue #10, `docs/architecture/validation/mission-review-01KQJNTP49SPQNNXQ1TG3BKKKW.md`):

1. Angular button components have empty CSS files — `sk-button.css` is not wired into the Angular build pipeline
2. Five html-js component stories are missing their CSS imports, so they render as unstyled HTML in Storybook
3. No html-js button story exists (FR-119 gap from previous mission)

## Context

- `packages/html-js/src/button/sk-button.css` already exists with all styles (`.sk-btn--primary`, `.sk-btn--secondary`, etc.) — it just needs to be loaded
- The Angular component CSS mechanism is `styleUrls` in the `@Component` decorator — add `sk-button.css` there
- The Storybook `webpackFinal` override processes CSS from `packages/html-js` path — but only when a story explicitly imports the CSS file
- All affected html-js stories are in the same package directory structure

## Subtask Guidance

### T001 — Wire `sk-button.css` into Angular button components

Each Angular button component has this structure in its TypeScript file:
```typescript
@Component({
  selector: 'sk-button-primary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sk-button-primary.component.html',
  styleUrl: './sk-button-primary.component.css',  // ← currently empty
})
```

Change `styleUrl` to `styleUrls` (plural) and add the shared button CSS:

```typescript
@Component({
  selector: 'sk-button-primary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sk-button-primary.component.html',
  styleUrls: [
    '../../../../../../html-js/src/button/sk-button.css',  // shared sk-btn styles
    './sk-button-primary.component.css',                   // component-specific
  ],
})
```

The relative path from `packages/angular/src/lib/button/` to `packages/html-js/src/button/sk-button.css` is `../../../../../../html-js/src/button/sk-button.css`. Verify this path is correct.

Apply the same fix to `sk-button-secondary.component.ts` and `sk-button-ghost.component.ts`.

**Alternative approach:** If the relative path causes issues with ng-packagr, add `sk-button.css` to the Angular package `project.json` `assets` and reference it as an asset URL. Document whichever approach you use.

### T002–T006 — Add CSS imports to 5 html-js stories

For each affected story file, add the CSS import as the **first** import in the file:

**`sk-check-bullet-html.stories.ts`**: Add `import './sk-check-bullet.css';`
**`sk-feature-card-html.stories.ts`**: Add `import './sk-feature-card.css';`
**`sk-form-field-html.stories.ts`**: Add `import './sk-form-field.css';`
**`sk-ribbon-card-html.stories.ts`**: Add `import './sk-ribbon-card.css';`
**`sk-section-banner-html.stories.ts`**: Add `import './sk-section-banner.css';`

Pattern (example for check-bullet):
```typescript
import './sk-check-bullet.css';   // ← ADD THIS LINE FIRST
import type { Meta, StoryObj } from '@storybook/html';
import { SkCheckBulletHTML } from './index';
// ... rest of file unchanged
```

### T007 — Create html-js button story

Create `packages/html-js/src/button/sk-button-html.stories.ts`:

```typescript
import './sk-button.css';
import type { Meta, StoryObj } from '@storybook/html';
import { SkButtonPrimaryHTML, SkButtonSecondaryHTML } from './index';

const meta: Meta = {
  title: 'Components/Button (HTML)',
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => SkButtonPrimaryHTML };
export const Secondary: Story = { render: () => SkButtonSecondaryHTML };
export const Ghost: Story = {
  render: () => `<button class="sk-btn sk-btn--ghost" type="button">Read the docs</button>`,
};
export const Small: Story = {
  render: () => `<button class="sk-btn sk-btn--primary sk-btn--sm" type="button">Book Demo</button>`,
};
export const Disabled: Story = {
  render: () => `<button class="sk-btn sk-btn--primary" type="button" disabled aria-disabled="true">Disabled</button>`,
};
export const AllVariants: Story = {
  render: () => `
    <div style="display:flex;gap:var(--sk-space-4);flex-wrap:wrap;align-items:center">
      <button class="sk-btn sk-btn--primary">Get started</button>
      <button class="sk-btn sk-btn--secondary">Star on GitHub</button>
      <button class="sk-btn sk-btn--ghost">Read the docs</button>
      <button class="sk-btn sk-btn--primary sk-btn--sm">Book Demo</button>
    </div>
  `,
};
```

### T008 — Verify Storybook build

```bash
npx nx run storybook:storybook:build 2>&1 | tail -5
# Must exit 0 within 3 minutes
```

If Angular button story fails to build (stylesheet path issue), try changing the Angular `styleUrls` to use the absolute workspace path format that Angular CLI supports, or use a CSS `@import` in the component CSS file instead.

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] Angular ButtonPrimary Storybook story renders with yellow fill (not unstyled)
- [ ] All 5 previously unstyled html-js stories (check-bullet, feature-card, form-field, ribbon-card, section-banner) render styled in Storybook
- [ ] `packages/html-js/src/button/sk-button-html.stories.ts` exists with 5+ story exports
- [ ] `npx nx run storybook:storybook:build` exits 0

## Risks

- The relative CSS path from Angular component to html-js CSS (`../../../../../../html-js/src/button/sk-button.css`) may be rejected by ng-packagr during the Angular library build. If so, use `styleUrls: ['~@spec-kitty/html-js/button/sk-button.css']` or copy the button CSS into the Angular component directory.
- Adding CSS imports to 5 stories simultaneously may expose other build issues — add them one at a time if the build fails.

## Reviewer Guidance

Open Storybook in a browser. Verify: (1) Angular ButtonPrimary shows yellow fill, pill shape; (2) each previously-broken html-js story now shows styled output; (3) the new html-js button story shows all variants. Run axe on the new button story.
