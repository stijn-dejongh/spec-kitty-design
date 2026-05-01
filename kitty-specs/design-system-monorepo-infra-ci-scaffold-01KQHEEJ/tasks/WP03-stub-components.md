---
work_package_id: WP03
title: Stub Components
dependencies:
- WP02
requirement_refs:
- FR-002
- FR-032
- NFR-005
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T016
- T017
- T018
- T019
- T020
agent: "claude:claude-sonnet-4-6:frontend-freddy:implementer"
shell_pid: "3051928"
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/angular/src/
execution_mode: code_change
owned_files:
- packages/angular/src/lib/stub/sk-stub.component.ts
- packages/angular/src/lib/stub/sk-stub.component.html
- packages/angular/src/lib/stub/sk-stub.component.css
- packages/angular/src/index.ts
- packages/angular/ng-package.json
- packages/html-js/src/stub/sk-stub.html
- packages/html-js/src/stub/sk-stub.css
- packages/html-js/src/stub/index.ts
- packages/html-js/src/index.ts
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Add a minimal stub component to each framework package. The stub exists solely to prove the build pipeline works end-to-end before Storybook is set up. No visual design, no real functionality — just enough to produce a valid compiled output.

## Context

- FR-032: a single minimal stub component per framework target, with a Storybook story that passes CI
- DIRECTIVE_001: component boundaries must be cleanly separated — Angular stub in `packages/angular/`, HTML stub in `packages/html-js/`
- The stub **must** reference at least one `--sk-*` token to prove the token constraint is enforced
- `packages/tokens` must be a peer dependency (not bundled) in both packages

## Subtask Guidance

### T016 — Generate Angular stub component

```bash
npx nx g @nx/angular:component sk-stub \
  --project=angular \
  --path=packages/angular/src/lib/stub \
  --export \
  --standalone
```

This creates `sk-stub.component.ts`, `sk-stub.component.html`, `sk-stub.component.css`.

### T017 — Write Angular stub component content

**`sk-stub.component.ts`**:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'sk-stub',
  standalone: true,
  templateUrl: './sk-stub.component.html',
  styleUrls: ['./sk-stub.component.css'],
})
export class SkStubComponent {}
```

**`sk-stub.component.html`**:
```html
<div class="sk-stub">
  <span class="sk-stub__label">Spec Kitty Design System — stub component</span>
</div>
```

**`sk-stub.component.css`**:
```css
.sk-stub {
  display: inline-flex;
  align-items: center;
  padding: var(--sk-space-2) var(--sk-space-4);
  background: var(--sk-surface-card);
  border: 1px solid var(--sk-border-default);
  border-radius: var(--sk-radius-sm);
}

.sk-stub__label {
  color: var(--sk-fg-default);
  font-family: var(--sk-font-sans);
  font-size: var(--sk-text-sm);
}
```

**Important**: All values use `--sk-*` custom properties. Stylelint will reject any hardcoded value.

### T018 — HTML/JS stub primitive

**`packages/html-js/src/stub/sk-stub.html`**:
```html
<!-- @spec-kitty/html-js — sk-stub primitive -->
<!-- Requires @spec-kitty/tokens to be loaded in the consuming page -->
<div class="sk-stub">
  <span class="sk-stub__label">Spec Kitty Design System — stub primitive</span>
</div>
```

**`packages/html-js/src/stub/sk-stub.css`**:
```css
/* Same rules as Angular stub — tokens only, no hardcoded values */
.sk-stub {
  display: inline-flex;
  align-items: center;
  padding: var(--sk-space-2) var(--sk-space-4);
  background: var(--sk-surface-card);
  border: 1px solid var(--sk-border-default);
  border-radius: var(--sk-radius-sm);
}
.sk-stub__label {
  color: var(--sk-fg-default);
  font-family: var(--sk-font-sans);
  font-size: var(--sk-text-sm);
}
```

**`packages/html-js/src/stub/index.ts`**:
```typescript
export const SkStubHTML = `<div class="sk-stub"><span class="sk-stub__label">Spec Kitty Design System — stub primitive</span></div>`;
```

### T019 — Export stubs from package entry points

**`packages/angular/src/index.ts`**:
```typescript
export { SkStubComponent } from './lib/stub/sk-stub.component';
```

**`packages/html-js/src/index.ts`**:
```typescript
export { SkStubHTML } from './stub/index';
```

### T020 — Verify builds and package sizes (NFR-005)

```bash
npx nx run-many --target=build --projects=tokens,angular,html-js
```

All three must exit 0. Check `packages/angular/dist/` and `packages/html-js/dist/` are populated.

**NFR-005 size gate** — run after build. At stub-component scale these will trivially pass, but establishes the gate for later:
```bash
# Angular package compressed size
tar -czf /tmp/angular-test.tgz packages/angular/dist/ && wc -c /tmp/angular-test.tgz
# Must be < 153600 bytes (150 KB). Remove /tmp/angular-test.tgz after check.

# HTML/JS package
tar -czf /tmp/html-js-test.tgz packages/html-js/dist/ && wc -c /tmp/html-js-test.tgz
```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `packages/angular/src/lib/stub/sk-stub.component.*` files created
- [ ] `packages/html-js/src/stub/` created with HTML, CSS, and index.ts
- [ ] Both packages export their stub from `src/index.ts`
- [ ] `npx nx run-many --target=build --projects=tokens,angular,html-js` exits 0
- [ ] No hardcoded color/spacing values in any stub CSS (Stylelint passes)

## Risks

- Angular 19 with Ivy strict mode may require explicit `schemas` in component metadata — check build output for template errors
- `ng-packagr` may require `tsconfig.lib.json` — generate with `npx nx g @nx/angular:library` if manual setup fails

## Reviewer Guidance

Run Stylelint against stub CSS files: must pass. Run `nx build angular` and confirm `dist/` is not empty. Check no `@spec-kitty/tokens` is listed in `dependencies` (must be `peerDependencies`).

## Activity Log

- 2026-05-01T18:40:18Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=3051928 – Started implementation via action command
