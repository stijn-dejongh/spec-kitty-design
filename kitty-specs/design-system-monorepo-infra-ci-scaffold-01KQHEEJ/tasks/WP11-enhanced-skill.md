---
work_package_id: WP11
title: Enhanced SKILL.md
dependencies:
- WP01
requirement_refs:
- FR-039
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T060
- T061
- T062
- T063
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "3100120"
history:
- date: '2026-05-01'
  event: created
agent_profile: curator-carla
authoritative_surface: skills/spec-kitty-design/
execution_mode: code_change
owned_files:
- skills/spec-kitty-design/**
role: curator
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load curator-carla
```

---

## Objective

Produce the production-grade Claude Code skill following the `deployable-skill-authoring` styleguide: a main `SKILL.md` with progressive disclosure to three sub-rule files (brand-voice, visual-identity, component-authoring). The skill must be usable by any AI agent working on SK-ecosystem surfaces.

## Context

- Research doc `002-llm-doctrine-bundle-evaluation.md` §3.1: shadcn shows Level 3 skill with sub-rules, live context, anti-patterns
- The shipped `deployable-skill-authoring` styleguide governs how skills should be written
- The current skill in `tmp/SKILL.md` is Level 1 (navigation only) — this WP produces Level 3
- DIRECTIVE_037: the SKILL.md must stay in sync with `doctrine/` artifacts

## Subtask Guidance

### T060 — `skills/spec-kitty-design/SKILL.md`

**`skills/spec-kitty-design/SKILL.md`**:
```markdown
---
name: spec-kitty-design
description: >
  Use this skill to generate, review, or work with Spec Kitty branded interfaces
  and design system artifacts. Triggers on: UI component work, CSS token usage,
  brand copy writing, Storybook story authoring, doctrine artifact authoring, or
  any request to produce SK-branded visual output. Also triggers for:
  "add a component", "write brand copy", "check token usage", "create a story".
user-invocable: true
allowed-tools: Read, Bash(npx nx *), Bash(npm run quality:*)
---

Read this file first. Load sub-rules on demand — do NOT preload all rules at session start.

## Quick context

**Product**: Spec Kitty — spec-driven AI development workflow. The design system serves
the operator dashboard, marketing site, docs, and blog.

**Voice**: Quirky-but-serious. Sentence case. No emoji. No exclamation marks. Concrete
outcomes over abstract claims. See → [rules/brand-voice.md](rules/brand-voice.md)

**Colors**: Primary = yellow `#F5C518` (`--sk-color-yellow`). Dark mode default.
All values via `--sk-*` custom properties only. See → [rules/visual-identity.md](rules/visual-identity.md)

**Type**: Body = `ui-sans-serif` (system). Display headlines = Falling Sky (`--sk-font-display`).
Code/mono = JetBrains Mono (`--sk-font-mono`). Editorial = Swansea (`--sk-font-reference`).

**Mascot**: Bespectacled cat with bow tie. Use existing assets in `tmp/assets/` for
supporting materials (docs, slides). Never embed in software distribution packages.

## When to load sub-rules

| Task | Load |
|---|---|
| Writing UI copy, headlines, labels | `rules/brand-voice.md` |
| Writing CSS / SCSS / component styles | `rules/visual-identity.md` |
| Writing Storybook stories or component code | `rules/component-authoring.md` |
| Authoring doctrine YAML | `doctrine/` directory directly |

## Token reference

Live token catalogue: `packages/tokens/dist/token-catalogue.json`

Semantic pairing rule: always pair `--sk-surface-*` with its `--sk-fg-on-*` counterpart.
Example: `background: var(--sk-surface-card)` → `color: var(--sk-fg-on-card)`.

## Critical constraints

- **No hardcoded values**: all CSS uses `--sk-*` only (SK-D01)
- **No mascot in packages**: illustration assets excluded from dist (SK-D02)
- **No emoji**: anywhere — not in copy, not in code comments
- **Sentence case**: headlines and labels always, no exceptions

## Quick validation

Before submitting any UI work:
```bash
npm run quality:stylelint   # catches hardcoded values
npm run quality:lint         # catches boundary violations
```
```

### T061 — `skills/spec-kitty-design/rules/brand-voice.md`

```markdown
# Brand Voice Rules

Source: `tmp/README.md` (CONTENT FUNDAMENTALS section)

## Principles

1. **Sentence case always.** Headlines, labels, button text — never title case.
   Exception: two-word CTA buttons may use Title Case ("Get Started", "Book Demo").

2. **No emoji.** Not in UI, not in docs, not in commit messages.

3. **No exclamation marks.** The brand voice is composed and credible, not exclamatory.

4. **Concrete > abstract.**
   - ✗ "Improved team productivity"
   - ✓ "Developers spend time building, not being blocked on finalized requirements"

5. **POV.**
   - Primary: "Spec Kitty" (third-person product)
   - Reader: "you" / "your team"
   - Never: "I" / "we" as default POV

6. **Canonical noun capitalization.** When referring to SK concepts, capitalize:
   Specs, Plans, Work Packages, Missions, Decision Moments, Charter, Doctrine, Teamspace.
   Use lowercase when referring to the generic concept ("a spec", "any mission").

7. **CLI flow text.** Use literal `->` (hyphen + greater-than) in mono:
   `spec -> plan -> tasks -> implement -> review -> merge`
   Never use an arrow character or SVG.

8. **Eyebrow labels.** ALL-CAPS in mono with wide tracking:
   `COMPETITIVE MATRIX`, `BY THE NUMBERS`, `v1.x — STABLE RELEASE`

9. **Inline code.** Mid-sentence code uses backticks with a faint pill:
   `spec-kitty orchestrator`, `kitty-specs`, `meta.json`

## Anti-patterns

| Wrong | Correct |
|---|---|
| "Bring Structure To AI-Assisted Delivery" | "Bring structure to AI-assisted delivery" |
| "All checks passed! 🎉" | "All checks passed." |
| "We help teams ship faster" | "Spec Kitty helps teams ship faster" |
| "improved developer velocity" | "developers spend time building, not waiting" |
| "create a mission" | "create a Mission" (when referring to the SK concept) |

## Quality test

A new contributor should write correct brand copy without looking at examples. If they
naturally reach for title case or an emoji, the guidance has not been internalized.
```

### T062 — `skills/spec-kitty-design/rules/visual-identity.md`

```markdown
# Visual Identity Rules

Source: `tmp/README.md` (VISUAL FOUNDATIONS section) + ADR-001, ADR-003

## Token authority

**All CSS values must use `--sk-*` custom properties.** No exceptions outside
`packages/tokens/src/tokens.css`.

```css
/* ✗ Wrong */
.btn { background: #F5C518; color: #000; border-radius: 999px; }

/* ✓ Correct */
.btn { background: var(--sk-color-yellow); color: var(--sk-fg-on-primary); border-radius: var(--sk-radius-pill); }
```

## Semantic pairing rule

Every surface token has a paired foreground token. Always use them together.

| Surface (background) | Paired foreground |
|---|---|
| `--sk-surface-page` | `--sk-fg-default` |
| `--sk-surface-card` | `--sk-fg-on-card` |
| `--sk-color-yellow` (CTA) | `--sk-fg-on-primary` |

**Violation example:**
```css
/* ✗ Unpaired — may fail contrast */
.hero { background: var(--sk-color-yellow); color: white; }

/* ✓ Paired */
.hero { background: var(--sk-color-yellow); color: var(--sk-fg-on-primary); }
```

## Dark mode default

Dark mode is the default. `--sk-surface-page: #0A0A0B` is the page background.
Sections differentiate via tint (card surface, input surface) — never via gradients.

## Color usage

- **Yellow** (`--sk-color-yellow`): Primary CTAs, active states, focus rings, accent. Use sparingly.
- **Haygold** (`--sk-color-haygold`): Resting warm tone, bullet dots, subtitle text.
- **Blue** (`--sk-color-blue`): Calm context surfaces, muted info backgrounds.
- **Purple** (`--sk-color-purple`): Architectural/cerebral sections (e.g., v2.x changelog).
- **Green** (`--sk-color-green`): Success, checkmarks, "by the numbers" banners.
- **Red** (`--sk-color-red`): Validation errors **only**.

## Iconography

Lucide-style stroke icons (2px stroke, rounded caps). No emoji.
Icon color follows the surface context — use the appropriate foreground token.

## Common patterns

```css
/* Card */
.card {
  background: var(--sk-surface-card);
  border: 1px solid var(--sk-border-default);
  border-radius: var(--sk-radius-md);        /* 16px */
}

/* Primary CTA */
.btn-primary {
  background: var(--sk-color-yellow);
  color: var(--sk-fg-on-primary);
  border-radius: var(--sk-radius-pill);       /* 999px */
  padding: var(--sk-space-3) var(--sk-space-7);
}

/* Pill tag / eyebrow chip */
.eyebrow {
  border-radius: var(--sk-radius-sm);         /* 8px */
  font-family: var(--sk-font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```
```

### T063 — `skills/spec-kitty-design/rules/component-authoring.md`

```markdown
# Component Authoring Rules

## Story structure (required)

Every component must have a Storybook story with these named exports:

```typescript
export const Default: Story = {};          // MANDATORY
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
// Interactive components additionally need:
export const Hover: Story = { play: async ({ canvasElement }) => { ... } };
export const Focus: Story = { play: async ({ canvasElement }) => { ... } };
export const Disabled: Story = {};         // if applicable
```

## a11y requirement

Every story must enable axe-core:
```typescript
parameters: { a11y: { disable: false } }
```

Never use `a11y: { disable: true }` in production stories. Accessibility waivers go in
the story description with a tracking issue link.

## Token dependency documentation

Every component's Storybook story `meta.description` should list the tokens it uses:
```typescript
const meta: Meta = {
  title: 'Atoms/Button',
  parameters: {
    docs: {
      description: {
        component: 'Uses: `--sk-color-yellow`, `--sk-fg-on-primary`, `--sk-radius-pill`, `--sk-space-3`, `--sk-space-7`'
      }
    }
  }
};
```

## Framework isolation

- Angular stories in `*.stories.ts`
- HTML stories in `*.html.stories.ts` or `*.stories.html.ts`
- Never import Angular components in an HTML story
- Never import HTML primitives in an Angular story

## Stub reference

The stub component (`packages/angular/src/lib/stub/`, `packages/html-js/src/stub/`)
is the minimal valid example. Follow its structure for new components.

## CI gates a new component must pass

1. `npm run quality:stylelint` — no hardcoded values
2. `npx nx run storybook:storybook:build` — Storybook builds
3. `node scripts/run-axe-storybook.js` — zero WCAG 2.1 AA violations
4. `npx playwright test apps/storybook/src/tests/visual.spec.ts --update-snapshots` — establish baseline
```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `skills/spec-kitty-design/SKILL.md` present with progressive disclosure structure and governance refs
- [ ] `rules/brand-voice.md` has principles + anti-pattern table
- [ ] `rules/visual-identity.md` has token authority rule + semantic pairing + code examples
- [ ] `rules/component-authoring.md` has story structure, a11y requirement, token docs, CI gate list
- [ ] Loading only `SKILL.md` is sufficient to find the correct sub-rule for any common task

## Reviewer Guidance

Test the progressive disclosure: given only `SKILL.md`, can you determine which sub-rule to open for a CSS token usage question? For a brand copy question? For a story authoring question? If not, the routing table in SKILL.md needs improvement.

## Activity Log

- 2026-05-01T18:51:01Z – claude – Level 3 SKILL.md with brand-voice, visual-identity, component-authoring sub-rules
- 2026-05-01T18:51:48Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=3100120 – Started review via action command
