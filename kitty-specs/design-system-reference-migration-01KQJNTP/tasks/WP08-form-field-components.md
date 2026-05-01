---
work_package_id: WP08
title: Form Field Components
dependencies:
- WP01
- WP02
requirement_refs:
- FR-118
- FR-119
- FR-120
- FR-122
planning_base_branch: main
merge_target_branch: main
branch_strategy: Work in lane worktree; merge to main on approval.
subtasks:
- T038
- T039
- T040
- T041
- T042
- T043
agent: claude
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/html-js/src/form-field/
execution_mode: code_change
owned_files:
- packages/html-js/src/form-field/**
- packages/angular/src/lib/form-field/**
- apps/storybook/src/tests/visual.spec.ts-snapshots/sk-form*
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Implement `FormField` (container with label + description slot), `FormInput`, and `FormTextarea` with all validation states (Default, Focus, Error, Disabled, Filled) in both packages. This is the most complex component category — the reference has 5 distinct states.

## Context

Read the reference: `tmp/preview/component-form.html` (65 lines — study all state variations).

Key states from the reference:
- **Default**: Transparent fill (`--sk-surface-input`), `--sk-border-default` border, `--sk-text-base` font, pill-ish radius (~12px)
- **Focus** (`.is-focused`): `--sk-border-focus` border (yellow), slight background lift
- **Error** (`.sk-error`): `--sk-color-red` border, red error message below
- **Disabled**: 40% opacity, `cursor: not-allowed`, non-editable appearance
- **Filled** (has value): Same as default but with content

The `FormField` is a wrapper that handles layout (label on top, input in middle, description/error message at bottom).

## Subtask Guidance

### T038 — FormField container HTML primitive

```html
<!-- sk-form-field.html -->
<div class="sk-form-field">
  <label class="sk-form-field__label" for="field-id">Email address</label>
  <!-- input/textarea goes here -->
  <span class="sk-form-field__description">We'll never share your email.</span>
</div>
```

CSS:
```css
.sk-form-field {
  display: flex;
  flex-direction: column;
  gap: var(--sk-space-2);
}
.sk-form-field__label {
  font-family: var(--sk-font-sans);
  font-size: var(--sk-text-sm);
  font-weight: var(--sk-weight-medium);
  color: var(--sk-fg-default);
}
.sk-form-field__description {
  font-size: var(--sk-text-xs);
  color: var(--sk-fg-muted);
}
.sk-form-field--error .sk-form-field__description { color: var(--sk-color-red); }
```

### T039 — FormInput + FormTextarea HTML primitives

```css
.sk-input,
.sk-textarea {
  width: 100%;
  padding: var(--sk-space-3) var(--sk-space-4);
  background: var(--sk-surface-input);
  border: 1px solid var(--sk-border-default);
  border-radius: var(--sk-radius-sm);
  font-family: var(--sk-font-sans);
  font-size: var(--sk-text-base);
  color: var(--sk-fg-default);
  outline: none;
  transition: border-color var(--sk-motion-duration-fast) var(--sk-motion-ease-out);
  box-sizing: border-box;
}
.sk-input:focus,
.sk-textarea:focus { border-color: var(--sk-border-focus); }
.sk-input:disabled,
.sk-textarea:disabled { opacity: 0.4; cursor: not-allowed; }
.sk-input[aria-invalid="true"],
.sk-textarea[aria-invalid="true"] { border-color: var(--sk-color-red); }
.sk-input::placeholder { color: var(--sk-fg-muted); }
.sk-textarea { min-height: 120px; resize: vertical; }
```

**Accessibility requirement**: Error state must use `aria-invalid="true"` on the input element AND the error message must be associated via `aria-describedby`. This is required for axe to pass.

```html
<input
  class="sk-input"
  id="field-email"
  type="email"
  aria-invalid="true"
  aria-describedby="field-email-error"
/>
<span id="field-email-error" class="sk-form-field__description" role="alert">
  Please enter a valid email address.
</span>
```

### T040 — Angular components

Generate `sk-form-field` with inputs: `label: string`, `description: string`, `errorMessage: string`, `hasError: boolean`.
Generate `sk-form-input` with standard Angular form control patterns (`ControlValueAccessor`) or simple `@Input() value`, `@Input() disabled`, `@Input() hasError`, `@Output() valueChange`.
Generate `sk-form-textarea` similarly.

The Angular components must use `aria-invalid` and `aria-describedby` correctly.

### T041 — Export from entry points

Add `FormFieldComponent`, `FormInputComponent`, `FormTextareaComponent` to Angular package index. Add HTML string exports to html-js index.

### T042 — Stories and axe

**Critical for axe compliance**: The error state story MUST use `aria-invalid="true"` and `aria-describedby` — these are required WCAG 2.1 AA for form validation.

Stories:
- `FormInput Default`: empty input with label
- `FormInput Focus`: `:focus` state (use a `play` function with `userEvent.click`)
- `FormInput Error`: `aria-invalid="true"`, error message linked via `aria-describedby`
- `FormInput Disabled`: `disabled` attribute
- `FormInput Filled`: input with value pre-set
- `FormTextarea Default`, `FormTextarea Error`

### T043 — Update visual regression baselines

## Definition of Done

- [ ] `FormField` wraps label + input + description/error message
- [ ] `FormInput` has Default, Focus (yellow border), Error (red border + aria), Disabled, Filled states
- [ ] `FormTextarea` has same states
- [ ] `aria-invalid` and `aria-describedby` correctly implemented on error state
- [ ] No hardcoded values — Stylelint passes
- [ ] Zero axe violations (including label association and error message linking)
- [ ] Visual baselines committed

## Risks

- Form accessibility is the most axe-critical component — missing `aria-describedby` on the error state will fail the gate
- Angular `ControlValueAccessor` implementation adds complexity; if it causes issues, fall back to simple `@Input`/`@Output` binding and document the deviation

## Reviewer Guidance

Manually check the error state story: open the axe panel in Storybook and verify zero violations. Specifically check that the error message is associated with the input via `aria-describedby`. Run `node scripts/run-axe-storybook.js` and verify it iterates the form stories.
