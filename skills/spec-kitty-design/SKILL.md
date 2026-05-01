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
