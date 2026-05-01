# Architectural Review: Design System Monorepo Infrastructure & CI Scaffold

**Author**: Architect Alphonso (ad-hoc session)
**Date**: 2026-05-01
**Profile**: `architect-alphonso` — review mode
**Governance scope**: DIRECTIVE_001, DIRECTIVE_003, DIRECTIVE_031, DIRECTIVE_032
**Mission**: `design-system-monorepo-infra-ci-scaffold-01KQHEEJ`
**Artifacts reviewed**: `spec.md`, `plan.md`, `tasks.md`, WP01–WP12, ADR-001 through ADR-005

---

## 1. Purpose

This document is the post-`/tasks` architectural review for the design system infrastructure mission. It evaluates whether the spec, plan, and 12 work packages are consistent with the five accepted ADRs and the charter directives. It does not replicate the `/analyze` report (which focused on requirement coverage and task metadata). This review focuses on architectural integrity, boundary correctness, and implementation sequencing risks.

---

## 2. ADR Conformance Assessment

### ADR-001: CSS Custom Properties as Token Distribution Format

**Verdict: Conformant**

- `@spec-kitty/tokens` contains only `:root { --sk-* }` declarations (WP02:T010) ✓
- `stylelint-declaration-strict-value` enforces the no-hardcoded-values constraint (WP02:T013) ✓
- CDN link path for zero-build-step HTML consumers is in WP04 Getting Started page and WP12 READMEs ✓
- No Tailwind utilities or CSS-in-JS outputs are introduced anywhere in the plan ✓

**Architectural concern (minor):** The Stylelint enforcement rule in WP02:T013 blocks hardcoded values across CSS files but does not explicitly exempt the HTML story inline `style=""` attributes that Storybook may generate. This is not a violation of ADR-001 (inline styles are outside the token package scope) but implementers should be made aware that Storybook canvas inline styles are not subject to Stylelint enforcement.

---

### ADR-002: Monorepo Package Topology — Separate Publishable Packages

**Verdict: Conformant with one sequencing risk**

The one-directional dependency graph (`tokens ← angular`, `tokens ← html-js`) is correctly encoded in:
- `project.json` tags (`scope:tokens`, `scope:angular`, `scope:html-js`, `scope:docs`, `type:publishable`, `type:internal`) (WP01:T004–T007) ✓
- ESLint `@nx/enforce-module-boundaries` rule with `depConstraints` in WP05:T027 ✓
- No `peerDependencies` in token package; peer deps in Angular and HTML/JS packages ✓

**Sequencing risk — MEDIUM:**

WP02 and WP05 both depend only on WP01 and are marked as parallel. However:
- WP02:T013 creates or configures `stylelint.config.mjs` (adds `stylelint-declaration-strict-value` rule using the token catalogue)
- WP05:T028 also configures `stylelint.config.mjs` (adds BEM class name pattern and other rules)
- After remediation F3, WP05 owns `stylelint.config.mjs`; WP02 no longer owns it

**Consequence:** If WP02 and WP05 run in parallel, both will attempt to write `stylelint.config.mjs`. WP02:T013 must either:
a) Run after WP05 (add WP05 as a dependency of WP02), or
b) Be split so that WP02 only installs `stylelint-declaration-strict-value` as a devDependency and WP05 creates `stylelint.config.mjs` with all rules including the token enforcement rule.

**Recommendation:** Add WP05 as an explicit dependency of WP02 in `WP02-token-package.md` frontmatter, changing `dependencies: [WP01]` to `dependencies: [WP01, WP05]`. This eliminates the write conflict and correctly sequences the Stylelint config creation before the token enforcement rule is added to it.

---

### ADR-003: Token Schema and Naming Convention

**Verdict: Conformant — pre-implementation gate correctly enforced**

- FR-034 (token reconciliation before implementation) is a hard gate in the plan: "WP-TOKEN-001 must not start until ADR-003 value reconciliation done" ✓
- `token-catalogue.json` is generated from `tokens.css` and serves as the machine-enumerable schema for Stylelint (WP02:T011–T012) ✓
- Semantic pairing rule is documented in WP10 doctrine artifacts and WP11 SKILL.md ✓
- Category-prefixed naming convention (`--sk-<category>-<name>`) is in WP02 implementation guidance ✓

**Architectural concern (minor):** WP02:T010 includes illustrative token values in the guidance. These values are explicitly flagged as "use values from ADR-003 addendum" but their presence risks an implementer treating them as authoritative before reconciliation is complete. The WP body handles this correctly with a prominent warning; reviewers should verify the ADR-003 addendum exists before approving WP02.

---

### ADR-004: Org-Layer Doctrine Distribution

**Verdict: Conformant — forward-compatible structure**

- `doctrine/` directory created with subdirectories per the spec (WP10) ✓
- `doctrine/graph.yaml` stub present as a forward-compatible DRG entry point ✓
- Doctrine artifacts follow spec-kitty YAML schema (`schema_version`, `id`, `intent`, `enforcement`, `procedures`) ✓
- `spec-kitty charter synthesize --dry-run` validation in WP10:T059 ✓
- WP11 produces an enhanced `SKILL.md` following `deployable-skill-authoring` styleguide ✓

**Architectural concern (minor):** The `doctrine/graph.yaml` stub format in WP10:T058 uses a custom schema (`graph_id`, `source_repo`, `artifacts`). The actual #832 `graph.yaml` format may differ — the assessment notes it's a stub, but the stub's structure should be minimal enough to avoid needing migration when #832 ships. If the stub declares artifact paths that don't match the #832 format, it will require rewriting. The stub should contain only comments and schema declarations, not artifact path references, until the #832 spec is final.

---

### ADR-005: npm Supply Chain Security Posture

**Verdict: Conformant — all controls distributed across correct WPs**

| Control | WP | Status |
|---|---|---|
| Dependabot (npm + Actions) | WP06:T033 | ✓ |
| `npm audit --audit-level=high` gate | WP06:T034 | ✓ |
| Lockfile drift check | WP06:T035 | ✓ |
| Actions SHA pin verifier | WP06:T036 | ✓ |
| `.npmignore` per package | WP06:T037 | ✓ (corrected by F1) |
| `npm ci --ignore-scripts` | WP07:T039 (CI template) | ✓ |
| npm provenance (`--provenance`) | WP09:T052 | ✓ |
| CycloneDX SBOM | WP09:T052 | ✓ |
| Nightly audit schedule | WP07:T039 (added by F6) | ✓ |
| Security allowlist | WP05:T032 | ✓ |
| surge.sh allowlist note | WP09:T051 (added by F15) | ✓ |

**Pre-flight gate correctly enforced:** `@spec-kitty` npm scope ownership is a manual pre-flight check in the plan, not a WP. This is the correct placement — it cannot be automated and must precede any release pipeline work.

---

## 3. DIRECTIVE Conformance

### DIRECTIVE_001 — Architectural Integrity (separation of concerns)

The WP ownership structure correctly separates:
- Token values (`WP02`) from token consumers (`WP03`, `WP04`)
- Linting rules (`WP05`) from CI wiring (`WP07`)
- Deployment (`WP09`) from quality gates (`WP07`, `WP08`)
- Doctrine governance (`WP10`) from implementation artifacts (`WP01–WP09`)

**One violation to address:** WP08:T049 instructs the implementer to extend `.github/workflows/ci-quality.yml`, which is owned by WP07. WP08's `owned_files` does not include `ci-quality.yml`, meaning the WP08 implementer will modify a file they do not own. This violates the ownership contract.

**Resolution options:**
- **Option A (preferred):** WP08 adds its job definitions to a separate include file (e.g., `.github/workflows/ci-visual-quality.yml`) and WP07 references it. Keeps separation clean.
- **Option B:** Add `.github/workflows/ci-quality.yml` to WP08's `owned_files` with a note that WP08 extends WP07's file.

Since CI YAML does not support `include:` natively in GitHub Actions, **Option B** is the pragmatic choice: add `ci-quality.yml` to WP08's `owned_files` and document that WP08 extends (appends to) the file created by WP07.

### DIRECTIVE_003 — Decision Documentation

All five ADRs are in place before implementation begins. ✓

One gap: there is no ADR for the Storybook multi-framework rendering strategy (FR-007 — Angular and HTML renderers in one catalog). The research doc notes this is complex and has a fallback (separate story files). An ADR recording this decision would satisfy DIRECTIVE_003 for a materially uncertain technical choice.

**Recommendation:** Add ADR-006 "Storybook Multi-Framework Rendering Strategy" before WP04 begins. The ADR should record: (a) attempt same-story multi-framework rendering; (b) if not achievable in Storybook 8.x, fall back to named story files convention. This converts the WP04 research risk into a documented decision.

### DIRECTIVE_031 — Context-Aware Design

Each WP is correctly scoped to its bounded context:
- Token Authority Context: WP02 only
- Component Library Context: WP03 (Angular), WP03 (HTML/JS)
- Documentation/Storybook Context: WP04
- CI/Security Context: WP05–WP09
- Doctrine Bundle Context: WP10–WP11

No WP crosses context boundaries inappropriately. The Stylelint write conflict (WP02/WP05) is a sequencing issue, not a context boundary violation — both WPs operate in the same tooling context.

### DIRECTIVE_032 — Conceptual Alignment

The `--sk-*` custom property namespace is used consistently as the canonical token vocabulary across all WPs. No informal aliases observed. ✓

One terminology note: WP04's Storybook story titles use `'Primitives/SkStub (Angular)'` and `'Primitives/SkStub (HTML)'`. The design system's canonical vocabulary from the charter uses "Primitive" for framework-agnostic HTML elements and "Component" for Angular elements. The `SkStub` is a stub primitive — the story grouping under `Primitives/` is correct. Once real components are added, Angular-specific entries should be grouped under `Components/` to preserve the atomic design taxonomy.

---

## 4. Sequencing and Dependency Assessment

### Critical sequencing issue

**WP02 ↔ WP05 parallel write conflict on `stylelint.config.mjs`**

As identified in ADR-002 assessment: WP02 and WP05 both operate on `stylelint.config.mjs` but are marked as parallel with the same single dependency (WP01). Resolution: add `WP05` to WP02's `dependencies`.

### All other dependencies: correct

The dependency graph in `tasks.md` correctly encodes:
- `WP01 → {WP02, WP05, WP06, WP10, WP11}` (parallel after workspace foundation)
- `WP02 → WP03 → WP04` (sequential product track)
- `WP05 + WP06 → WP07` (security and linting tools before CI wiring)
- `WP04 + WP07 → {WP08, WP09}` (Storybook + CI before visual gates and deployment)
- `WP04 + WP07 → WP12` (docs after both tracks complete)

The plan's pre-flight gates (npm scope ownership, FR-034 reconciliation) are correctly positioned outside the WP sequence as manual preconditions.

---

## 5. Architectural Recommendations

The following items require action before implementation begins. Listed by priority:

### Required before first WP launch

**AR-01 — Add WP05 as dependency of WP02 (Stylelint write conflict)**
File: `kitty-specs/.../tasks/WP02-token-package.md`
Change: `dependencies: [WP01]` → `dependencies: [WP01, WP05]`
Rationale: WP05 creates `stylelint.config.mjs`; WP02:T013 must extend it, not overwrite it.

**AR-02 — Add `ci-quality.yml` to WP08 owned_files**
File: `kitty-specs/.../tasks/WP08-visual-a11y-browser-gates.md`
Change: add `.github/workflows/ci-quality.yml` to `owned_files` with a note that WP08 appends to the file created by WP07.
Rationale: WP08:T049 explicitly modifies this file; without ownership declaration, the implementer operates outside their sanctioned scope (DIRECTIVE_001 violation).

### Recommended before WP04 launch

**AR-03 — Author ADR-006: Storybook Multi-Framework Rendering Strategy**
Location: `docs/architecture/decisions/2026-05-01-6-storybook-multi-framework-rendering.md`
Content: Record the decision to attempt same-story multi-framework rendering in Storybook 8.x, with the explicit fallback to named story files if same-page tabs are not achievable. This is a materially uncertain technical choice that affects FR-007 compliance.
Rationale: DIRECTIVE_003 requires material technical decisions to be documented before implementation.

### Deferred (post-mission)

**AR-04 — Simplify `doctrine/graph.yaml` stub to comments-only**
After #832 ships and its graph format is finalized, the current stub's `artifacts:` block may need migration. Reduce the stub to a commented placeholder to minimize migration risk.

**AR-05 — Update charter token filename reference**
Charter performance benchmark and review policy reference `colors_and_type.css` / `colors_and_type.scss`. Update to `packages/tokens/src/tokens.css` post-mission.

---

## 6. Summary

| Category | Status | Critical Items |
|---|---|---|
| ADR-001 (token distribution) | ✅ Conformant | None |
| ADR-002 (monorepo topology) | ⚠️ Minor sequencing risk | AR-01: WP02 must depend on WP05 |
| ADR-003 (token schema) | ✅ Conformant | Pre-flight gate correctly enforced |
| ADR-004 (doctrine distribution) | ✅ Conformant | Stub simplification recommended (AR-04) |
| ADR-005 (security posture) | ✅ Conformant | All controls present after F6 remediation |
| DIRECTIVE_001 | ⚠️ One violation | AR-02: WP08 must claim ci-quality.yml ownership |
| DIRECTIVE_003 | ⚠️ One gap | AR-03: ADR-006 for Storybook rendering strategy |
| DIRECTIVE_031 | ✅ Conformant | Bounded contexts correctly scoped |
| DIRECTIVE_032 | ✅ Conformant | `--sk-*` namespace consistently applied |

**Overall verdict:** The mission spec, plan, and WP structure are architecturally sound. Two required actions (AR-01, AR-02) and one recommended action (AR-03) should be resolved before implementation begins. No spec or charter amendment is required — these are implementation sequencing and documentation concerns only.

Handoff from Architect Alphonso → Planner Priti for AR-01 and AR-02 execution, then to the implementing agents.
