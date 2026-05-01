# Quality Attribute Assessment (AMMERSE): Spec Kitty Design System

| Field | Value |
|---|---|
| **Initiative** | Spec Kitty Design System — core architectural choices |
| **Owner** | Stijn Dejongh |
| **Date** | 2026-05-01 |
| **Status** | Accepted |
| **Related ADRs** | ADR-001 (token format), ADR-002 (monorepo), ADR-003 (token schema), ADR-004 (doctrine), ADR-005 (security) |
| **Related specs** | `kitty-specs/design-system-monorepo-infra-ci-scaffold-01KQHEEJ/spec.md` |

---

## Scope

The architectural choices under assessment:
1. CSS custom properties as the token distribution format (ADR-001)
2. Monorepo with separate publishable packages per framework target (ADR-002)
3. `doctrine/` as org-layer governance source (ADR-004)
4. npm supply chain security posture (ADR-005)

**Out of scope:** Individual component implementation decisions; Storybook version selection; CI tool selection.

---

## AMMERSE Base Impact Assessment

### Agile (A) — adapt quickly, incorporate feedback, remain flexible

| Aspect | Assessment |
|---|---|
| Positive | Additive package model: new framework targets are added without changing existing packages. Token-only consumers are unaffected by component churn. Doctrine bundle grows incrementally. |
| Negative | Monorepo tooling (nx/turborepo) adds a coordination layer. Angular LTS lifecycle creates predictable but mandatory adaptation cycles. Token reconciliation gate (FR-034) delays first release. |
| **Combined impact** | `+0.5` |

**Rationale:** The architecture is deliberately extensible. The token layer is stable-by-design; framework packages absorb ecosystem volatility. The monorepo structure adds tooling complexity but that is a one-time setup cost, not a recurring adaptation tax.

---

### Minimal (Mi) — simplicity, avoid unnecessary complexity

| Aspect | Assessment |
|---|---|
| Positive | CSS custom properties are native browser technology — no transpilation, no runtime, no framework dependency for the token package. The `@spec-kitty/tokens` package is a single CSS file. |
| Negative | Monorepo orchestration (nx or turborepo) is non-trivial infrastructure. The full CI pipeline (Lighthouse + Playwright + visual regression + accessibility + linting) is complex. Three separate publishable packages add release coordination overhead. |
| **Combined impact** | `+0.3` |

**Rationale:** The token layer itself is simple. The complexity budget is spent on CI quality enforcement and monorepo tooling — both are one-time infrastructure costs that pay dividends per component added. The alternative (monolithic CSS) is operationally simpler but architecturally brittle.

---

### Maintainable (Ma) — ease of keeping the system in working condition over time

| Aspect | Assessment |
|---|---|
| Positive | Strict package boundary enforcement (no cross-package value duplication). Semantic token naming convention (ADR-003) makes the token catalogue discoverable. All key decisions documented as ADRs. Dependabot automates dependency updates. `uv lock`-equivalent lockfile check prevents drift. |
| Negative | Angular LTS rotation requires a planned major-version update of `@spec-kitty/angular` every ~18 months. Storybook major version churn creates periodic CI tooling rework. Three-repo synchronization (design system, SK dashboard, docsite) requires consumer update coordination. |
| **Combined impact** | `+0.6` |

**Rationale:** The documentation investment (ADRs, system context canvas, SAD-lite) and the strict constraint enforcement (linting, token authority rule) make the system maintainable for contributors who did not build it. The lifecycle obligations are known and bounded.

---

### Environmental (E) — cultural fit, societal/ethical impact, standards alignment

| Aspect | Assessment |
|---|---|
| Positive | WCAG 2.1 AA as a hard gate aligns with accessibility obligations. Dark mode as default matches the existing marketing site convention and user expectations. Brand voice rules ("no emoji", concrete outcomes) align with the established Spec Kitty brand. The org-layer doctrine model aligns with spec-kitty's governance philosophy. |
| Negative | The `--ignore-scripts` security constraint breaks the standard npm developer experience and requires explicit allowlisting for native-compilation packages — a friction point for contributors used to plain `npm install`. |
| **Combined impact** | `+0.7` |

**Rationale:** The design choices closely match the existing Spec Kitty cultural and product context. The accessibility gate is a positive signal for adoption by organisations with compliance requirements. The `--ignore-scripts` friction is real but small compared to the security benefit.

---

### Reachable (R) — practical goals, achievable within constraints

| Aspect | Assessment |
|---|---|
| Positive | The infrastructure-first scope (no feature components in the first mission) limits the v1 blast radius. The stub component (FR-032) provides a concrete end-to-end validation without requiring a complete component library. Single maintainer with clear ADR decisions reduces ambiguity. |
| Negative | The token reconciliation gate (FR-034) is a pre-implementation dependency on external action (marketing site CSS audit). The 10-minute CI budget (NFR-002) is achievable at stub-component scale but will require active maintenance. The `@spec-kitty` npm scope ownership is an external pre-flight dependency. |
| **Combined impact** | `+0.4` |

**Rationale:** The scope is achievable for a single maintainer with clear priorities. The two pre-flight dependencies (scope ownership, token reconciliation) are the primary schedule risks — both are short-horizon checks, not long-horizon unknowns.

---

### Solvable (S) — ability to effectively address and resolve problems

| Aspect | Assessment |
|---|---|
| Positive | The architecture directly addresses the root cause of brand drift (no single token source) and the root cause of AI agent brand inconsistency (no machine-queryable governance). The `--sk-*` token authority eliminates the multi-vocabulary problem structurally, not just procedurally. |
| Negative | The design system solves the "publishing" half of the consistency problem but not the "adoption" half — consuming repositories still need to migrate to the new token layer. This migration is acknowledged but out of scope for this repository. |
| **Combined impact** | `+0.8` |

**Rationale:** The architecture is a direct, complete solution to the problem it owns. The adoption problem is real but correctly scoped to consuming repositories. A design system that publishes correctly is a necessary precondition for adoption.

---

### Extensible (Ex) — new behaviour can be added without altering the core architecture

| Aspect | Assessment |
|---|---|
| Positive | New framework targets (Vue, Svelte, React) are additive packages — no existing package changes. New `--sk-*` tokens are additive (minor version bump). The `doctrine/` bundle grows incrementally. The org-layer model (`doctrine fetch`) is designed for extension. |
| Negative | A new token category requires updating the token schema ADR (ADR-003) and regenerating the catalogue. A breaking token rename requires a major version bump and consumer coordination. Adding a fundamentally different distribution channel (WASM? CSS Houdini?) would require a new ADR. |
| **Combined impact** | `+0.7` |

**Rationale:** Extension is explicitly designed into the architecture at every level. The governance overhead for breaking changes (ADR updates, major version bumps) is the correct friction — it prevents accidental breaking changes from being invisible.

---

## Trade-Off Summary

| Trade-off | What is sacrificed | What is gained | Reasoning |
|---|---|---|---|
| CSS custom properties over Tailwind | Utility-class DX for Tailwind-native projects | Zero-build-step static HTML consumer; single authoritative namespace | Static HTML/Jekyll/Hugo path is a hard requirement; Tailwind projects can still map `--sk-*` to their config |
| Separate packages over single package | Simple "one install" consumer story | Independent versioning; consumers install only what they need | Angular LTS lifecycle must not force bumps on HTML-only consumers |
| Monorepo over multi-repo | Repo-level isolation | Shared CI tooling; coordinated releases; single contributor onboarding | Multi-repo coordination cost exceeds isolation benefit at this scale |
| Security gates (`--ignore-scripts`, SHA pinning) | Standard `npm install` DX for contributors | Defence against postinstall hook attacks; Actions supply chain hardening | npm ecosystem attack history justifies the friction |
| Pre-implementation token reconciliation gate | Earlier first release | Token authority is clean from the first published version | A first release with wrong token values creates consumer debt that is expensive to undo |

---

## Open Questions

| Question | Owner | Deadline |
|---|---|---|
| OKLCH vs hex/hsl for token values (affects ADR-003 addendum) | Maintainer | Before token reconciliation (FR-034) |
| PR preview deployment tooling choice (affects NFR-008 and CI budget) | Planner | Planning phase |
| nx vs turborepo monorepo orchestrator | Planner | Planning phase |
