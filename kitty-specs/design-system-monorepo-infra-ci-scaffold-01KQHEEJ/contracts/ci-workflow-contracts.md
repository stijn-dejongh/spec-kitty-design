# CI Workflow Contracts

*Phase 1 output — workflow shapes and job contracts for each GitHub Actions workflow*

---

## `ci-quality.yml` — PR quality gates

**Trigger:** Pull request to `main`; push to `main`; path-filtered per FR-035.

**Job dependency graph:**

```
changes (path filter)
    ├── lint-code           → ESLint + Stylelint + HTMLHint + commitlint
    ├── security            → npm audit (hard gate) + lockfile check
    ├── storybook-build     → nx storybook:build (< 3 min, NFR-003)
    │       ├── a11y        → axe-playwright WCAG 2.1 AA (hard gate)
    │       ├── visual-reg  → Playwright snapshot comparison (hard gate)
    │       ├── lighthouse  → Lighthouse CI thresholds
    │       └── playwright  → cross-browser smoke (Chrome, Firefox, Safari)
    └── workflow-lint       → SHA pin check on all workflow files
gate (all required jobs passed → merge eligible)
```

**Hard gates (block merge):** `security`, `a11y`, `visual-reg`, `gate`
**Advisory (reported, do not block):** `lighthouse`

---

## `storybook-deploy.yml` — GitHub Pages

**Trigger:** Push to `main` only.

**Steps:**
1. Checkout (SHA-pinned)
2. `npm ci --ignore-scripts`
3. `npx nx run storybook:storybook:build`
4. Deploy `apps/storybook/storybook-static/` to GitHub Pages
5. Post stable URL to job summary

**Permissions:** `pages: write`, `id-token: write`

---

## `pr-preview.yml` — surge.sh preview

**Trigger:** Pull request opened or updated.

**Steps:**
1. Checkout (SHA-pinned)
2. `npm ci --ignore-scripts`
3. `npx nx run storybook:storybook:build`
4. Deploy to `https://spec-kitty-design-pr-${{ github.event.pull_request.number }}.surge.sh`
5. Post preview URL as PR comment via `actions/github-script`

**Secrets required:** `SURGE_TOKEN` (repository secret)
**PR comment format:** `📦 Storybook preview: https://spec-kitty-design-pr-<N>.surge.sh`

---

## `release.yml` — npm publish + SBOM

**Trigger:** Push of tag matching `v*.*.*`.

**Steps:**
1. Checkout (SHA-pinned, `fetch-depth: 0`)
2. `npm ci --ignore-scripts`
3. Run full CI quality check suite (gates must pass before publish)
4. `npx nx run-many --target=build --projects=tokens,angular,html-js`
5. `npm pack --dry-run` for each package (dist contents audit — no secrets, no source maps)
6. Generate CycloneDX SBOM: `npx @cyclonedx/cyclonedx-npm --output-file spec-kitty-design-sbom.cdx.json`
7. `npm publish --provenance --access public` for each package
8. Upload SBOM to GitHub Release

**Secrets required:** `NPM_TOKEN` (repository secret, scoped to `@spec-kitty` publish)
**Permissions:** `id-token: write` (required for npm provenance attestation)

---

## `dependabot.yml` — automated dependency updates

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
    groups:
      angular: { patterns: ["@angular/*", "@nx/angular*"] }
      storybook: { patterns: ["@storybook/*", "storybook"] }
      playwright: { patterns: ["@playwright/*"] }
      nx: { patterns: ["@nx/*", "nx"] }
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
    open-pull-requests-limit: 10

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 5
```

**Note:** Major version bumps for any package require a dedicated evaluation PR, not an automated update. Dependabot opens the PR but it is excluded from auto-merge.
