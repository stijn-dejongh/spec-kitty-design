# Supply Chain Security Evaluation: npm Ecosystem and Frontend Volatility

**Author**: Architect Alphonso (ad-hoc session)
**Date**: 2026-05-01
**Status**: Draft — informs charter update and spec additions
**Scope**: npm supply chain attack surface, frontend ecosystem volatility, security posture for the design system
**Reference baseline**: spec-kitty Python security stack (`ci-quality.yml`, `release.yml`, `SECURITY-POSITION.md`)

---

## 1. The Problem in Plain Terms

The design system is entering a dependency ecosystem with a materially different risk profile from spec-kitty's Python stack. This is not a reason to avoid npm; it is a reason to enter it with explicit countermeasures and a documented risk acceptance posture.

Three structural properties make the npm frontend ecosystem a higher-risk dependency surface:

1. **Volume and minimal vetting.** npm hosts approximately 2.4 million packages. Publication requires no review. A package can go from `npm publish` to transitive dependency in hours.

2. **Deep transitive trees.** A typical Angular or Storybook project installs 800–1,500 packages at `npm install`. The attacker surface is not the direct dependencies in `package.json`; it is every transitive dependency of every tool, framework, and plugin.

3. **Lifecycle hook execution.** npm `postinstall`, `preinstall`, and `prepare` scripts execute arbitrary code at install time — not at runtime. A compromised transitive dependency can exfiltrate environment variables, read SSH keys, or install persistent processes the moment a developer runs `npm install`.

---

## 2. What spec-kitty Already Does (the Baseline to Match)

spec-kitty's Python CI stack enforces the following security controls as **hard gates** (block PR merge on failure):

| Control | Tool | When |
|---|---|---|
| SAST — static code analysis | Bandit (`--severity-level medium --confidence-level medium`) | Every PR, every push to main |
| CVE dependency scan | pip-audit | Every PR, every push to main |
| Lockfile drift prevention | `uv lock --check` — fails if `uv.lock` would regenerate | Every PR |
| Release integrity | Twine validation + version isolation check | Release tag only |
| SBOM generation | CycloneDX (`cyclonedx-py environment`) | Release tag only |
| Code quality (advisory) | SonarCloud — nightly on main; advisory on PRs | Nightly + PR |
| Branch protection | No direct push to main; all via PR | Always |
| Boundary enforcement | Custom workflow: orchestrator package must not exist | Every PR touching relevant paths |

**What is absent on the Python side:** Dependabot for automated dependency PRs. No Renovate config found in the repository. Security updates rely on the `pip-audit` gate catching them reactively, not proactively.

**Translation requirement:** Every control above must have an equivalent for the npm side of the design system. Where no direct equivalent exists, the gap must be explicitly accepted and documented.

---

## 3. Known npm Attack Surfaces

### 3.1 Supply chain attacks via compromised packages

The npm ecosystem has a documented history of high-severity supply chain attacks:

- **event-stream (2018)**: 2 million weekly downloads; attacker gained maintainership and inserted bitcoin-wallet theft code in a transitive dependency
- **ua-parser-js (2021)**: 8 million weekly downloads; maintainer account hijacked; malware installer in postinstall hook
- **node-ipc (2022)**: Maintainer deliberately added destructive code targeting Russian and Belarusian IP addresses
- **colors / faker (2022)**: Maintainer deliberately broke own packages; 19,000+ dependent projects affected
- **xz-utils (2024)**: Multi-year social engineering attack; not npm-specific but illustrates the "trusted contributor" attack vector

The pattern: packages with large downstream adoption, minimal active maintenance, or single maintainers are the highest-risk targets. Design systems and UI toolkits are disproportionately targeted because they sit in nearly every frontend project's dependency tree.

### 3.2 Dependency confusion / namespace confusion

Microsoft's 2021 whitepaper documented dependency confusion attacks: an attacker publishes a public npm package with the same name as a private/internal package. When a developer runs `npm install`, the registry resolves the public (malicious) package by version precedence.

For the `@spec-kitty` scope: a scoped package (`@spec-kitty/tokens`) is protected against confusion attacks as long as the scope is claimed. **An unclaimed npm scope is an open door.** This is the pre-flight check identified in the architectural evaluation — it is also a security control, not just an operational convenience.

### 3.3 Typosquatting

Packages named to catch common typos: `angularr`, `storybook-ui`, `@angular/corr`. These are published speculatively and activated when someone miskeys an install command. Mitigation: use a lockfile at all times and never install packages manually outside of a PR review.

### 3.4 Postinstall script execution

Unlike Python's pip, npm executes lifecycle scripts (`postinstall`, `install`, `prepare`) during `npm install`. This is a unique attack surface with no equivalent in the Python pip ecosystem:

- A malicious `postinstall` runs with full user-level permissions
- It executes before the developer has inspected the package
- It can phone home, exfiltrate secrets, or modify other files

Mitigation: `--ignore-scripts` flag for installs in CI (note: some legitimate packages require postinstall for native compilation — these must be explicitly audited and allowlisted).

### 3.5 Lockfile poisoning

`package-lock.json`, `pnpm-lock.yaml`, and `yarn.lock` are large, autogenerated, and rarely read by humans. An attacker with write access to the repo (or via a compromised PR) can modify the lockfile to resolve a legitimate package name to a malicious version or URL. This attack bypasses `npm audit` because the lockfile entry appears internally consistent.

Mitigation: `npm ci` (not `npm install`) in CI — `npm ci` requires the lockfile to be present and does not update it. Combined with a lockfile drift check (equivalent to SK's `uv lock --check`), this ensures the lockfile is the authoritative source and has not been silently regenerated.

### 3.6 GitHub Actions supply chain

GitHub Actions themselves are a supply chain vector. Using `actions/checkout@v4` (a mutable tag) means the action's code can change between runs. A compromised GitHub Actions package can exfiltrate `GITHUB_TOKEN`, `NPM_TOKEN`, and any secrets available to the workflow.

Mitigation: pin all GitHub Actions to a specific commit SHA rather than a mutable tag. Example: `uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683` (SHA of `v4.2.2`) rather than `uses: actions/checkout@v4`. This is an operational discipline that must be established in the initial CI scaffold.

---

## 4. Frontend Ecosystem Volatility

### 4.1 Angular release lifecycle

Angular publishes a major version every six months (November and May). Each major version has an active support window of 18 months. The design system's Angular package (C-007: targets current LTS) will require a major update approximately every 18 months.

Implications:
- The `@spec-kitty/angular` package must maintain a clear statement of its supported Angular version range
- Breaking Angular upgrades require a major version bump of `@spec-kitty/angular`
- Consumers pinned to an older Angular version cannot use newer design system components — this is a known version lock risk

### 4.2 Storybook release history

Storybook is one of the most volatile major projects in the frontend ecosystem:
- v6 → v7 (2023): breaking changes to story format, addon API, and bundler configuration
- v7 → v8 (2024): breaking changes to component testing integration and renderer packages
- v8 → v9 (expected 2025/2026): another significant surface area change

Storybook is a development and documentation dependency — not a runtime dependency of published packages. This limits the blast radius: a Storybook upgrade affects contributor tooling and CI, not consumers of `@spec-kitty/tokens` or `@spec-kitty/angular`. However, it means the CI scaffold may require periodic update maintenance separate from component work.

### 4.3 The "left-pad moment" risk

The npm ecosystem's dependency on minimally maintained packages creates the "left-pad" scenario: a package with 11 lines of code, taken down by its author, breaking thousands of downstream projects. The design system should avoid transitive dependency chains that pass through single-maintainer, minimally maintained packages for anything in the critical path (token output, component rendering).

Mitigation: prefer established scopes (`@angular/*`, `@storybook/*`, `@playwright/*`) over community packages for critical tooling. Treat any direct dependency with fewer than 10,000 weekly downloads and fewer than 3 contributors as a risk to document.

---

## 5. Security Posture: What the Design System Must Implement

The following controls map the SK Python security stack to the npm/frontend context, with additions specific to npm's attack surface.

### 5.1 Hard gates (must block PR merge)

| Control | npm/frontend equivalent | Note |
|---|---|---|
| CVE dependency scan | `npm audit --audit-level=high` | Fail on high or critical; moderate reported but advisory |
| Lockfile drift prevention | `npm ci` in all CI jobs + lockfile sync check | Never `npm install` in CI; lockfile must be committed |
| SAST | ESLint security plugin (`eslint-plugin-security`) + Semgrep for JavaScript | Covers injection, unsafe regex, path traversal |
| Postinstall script audit | `--ignore-scripts` in CI installs where possible; allowlist exceptions explicitly | Requires per-package review for native addons |
| Actions SHA pinning | All `uses:` directives pinned to commit SHA | Enforced in CI scaffold from day one |
| Scope ownership verification | Pre-flight: confirm `@spec-kitty` npm scope is owned | One-time, but blocks all publishing until done |

### 5.2 Periodic / scheduled controls

| Control | Tool / mechanism | Cadence |
|---|---|---|
| Automated dependency updates | Dependabot (npm + GitHub Actions) | Configured on repo; weekly PRs |
| Scheduled CVE audit | `npm audit` on a cron schedule | Nightly, same pattern as SK's Bandit nightly |
| SBOM generation | `@cyclonedx/cyclonedx-npm` at release time | Release tag only, same pattern as SK |
| Dependency review | GitHub Dependency Review Action on PRs | Automated — blocks PRs that add vulnerable dependencies |

### 5.3 Release-time controls

| Control | Mechanism |
|---|---|
| npm Provenance | Publish with `--provenance` in GitHub Actions; links published package to source commit and CI build. Verifiable via `npm info --json` |
| Package contents audit | `npm pack --dry-run` before publish; verify no secrets, source maps, or non-distribution files are included |
| Version tagging | Semver tag triggers release; no manual `npm publish` from developer machines |
| 2FA enforcement | Require 2FA on the `@spec-kitty` npm account for all publish operations |

### 5.4 Governance controls (policy, not tooling)

| Policy | Rationale |
|---|---|
| New direct dependencies require a rationale comment in the PR description | Forces conscious addition; creates audit trail |
| Any new dependency with <10k weekly downloads or <3 contributors requires maintainer approval | Left-pad / event-stream risk profile |
| `package-lock.json` / `pnpm-lock.yaml` is always committed and never gitignored | Lockfile is the integrity record |
| No `*` or `latest` version ranges in `package.json` — always exact or bounded ranges | Prevents silent upgrade to a compromised version |
| No `npm install` without reviewing the lockfile diff in the PR | Lockfile diffs must be reviewed, not rubber-stamped |
| `postinstall` scripts from new dependencies must be explicitly reviewed before allowing | One line of defence against hook-based attacks |

---

## 6. Dependabot Configuration

spec-kitty has no Dependabot configuration (confirmed: no `.github/dependabot.yml` found). The design system should establish this from the start for both npm and GitHub Actions:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
    groups:
      angular:
        patterns: ["@angular/*"]
      storybook:
        patterns: ["@storybook/*"]
      playwright:
        patterns: ["@playwright/*"]
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]  # major bumps require manual review
    open-pull-requests-limit: 10

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 5
```

Grouping reduces noise (one PR for all Angular updates, one for all Storybook updates). Major version bumps are excluded from auto-PRs — they require a dedicated evaluation before upgrade.

---

## 7. SBOM and Provenance

spec-kitty generates a CycloneDX SBOM at release time using `cyclonedx-py`. The design system should match this for the npm side:

- **SBOM**: `@cyclonedx/cyclonedx-npm` generates a CycloneDX JSON SBOM from `node_modules/`. Published as a GitHub Release artifact alongside the npm packages.
- **npm provenance**: Since 2023, npm supports package provenance attestation. Publishing from GitHub Actions with `--provenance` creates a signed record linking the package to its source repository, workflow run, and commit SHA. This is verifiable by consumers and creates a chain of custody.

Provenance does not prevent malicious code from shipping; it proves that the shipped code came from a specific, auditable pipeline. Combined with branch protection and required CI checks, it makes supply chain tampering significantly harder to conceal.

---

## 8. The Residual Risk Acceptance Statement

No set of controls eliminates supply chain risk from the npm ecosystem. The following residual risks are accepted with documentation:

| Residual risk | Why accepted | Mitigation in place |
|---|---|---|
| Malicious postinstall in a transitive dependency of a development tool (Storybook, Playwright, etc.) | Development tools are not published to consumers; blast radius is contributor workstations only | `--ignore-scripts` in CI; Dependabot for updates |
| Zero-day CVE in a direct dependency between scan runs | npm audit has inherent lag; new CVEs are not retroactively detected on already-installed versions | Nightly scheduled audit; Dependabot alerts |
| Compromised GitHub Actions in a pinned SHA (SHA itself is malicious) | SHA pinning prevents tag-based redirects but not a SHA that was malicious from creation | Using only widely audited official Actions |
| npm account takeover of `@spec-kitty` scope | Requires attacker to bypass npm 2FA | 2FA enforcement; Dependabot monitors new publish events |

---

## 9. Gap Between Current Spec and Required Security Posture

The current spec and charter do not address supply chain security. The following additions are required:

### Charter additions

- **Security posture policy**: Consuming npm packages is permitted under explicit controls. Any new direct dependency must pass: scope credibility check, weekly download threshold (>10k), contributor count (>2), CVE-free at time of addition.
- **Dependency governance rule**: No `*` or `latest` version specifiers. Lockfile always committed. Major version bumps require maintainer sign-off.
- **Tooling provenance commitment**: npm packages published with `--provenance`. SBOM generated at release. Actions pinned by SHA.

### Spec additions

- **FR-040**: A `.github/dependabot.yml` is configured for npm packages and GitHub Actions, grouping framework updates and excluding major version auto-PRs
- **FR-041**: The CI pipeline runs `npm audit --audit-level=high` as a hard gate on every PR; a scheduled nightly audit also runs on the main branch
- **FR-042**: A lockfile integrity check blocks PRs where the lockfile has drifted from the manifest (equivalent to SK's `uv lock --check`)
- **FR-043**: All GitHub Actions in CI workflows are pinned to commit SHAs rather than mutable version tags
- **FR-044**: npm packages are published with the `--provenance` flag in the GitHub Actions release workflow
- **FR-045**: A CycloneDX SBOM is generated and published as a GitHub Release artifact alongside each package release
- **FR-046**: The CI install step uses `npm ci` (not `npm install`) and the `--ignore-scripts` flag; any package requiring a postinstall hook is documented in a security allowlist with rationale

### New constraint

- **C-009**: No `*` or `latest` version specifiers in any `package.json` file; all dependencies use exact or caret-bounded ranges. Lockfile is always committed and never gitignored.

---

## 10. Architectural Note on Framework Lifecycle Risk

The Angular LTS obligation (C-007) is also a security obligation. Angular LTS versions receive security patches; unsupported versions do not. The design system must track Angular LTS status and initiate the upgrade cycle no later than 3 months before LTS expiry. This should be a scheduled maintenance item, not a reactive emergency.

Storybook, as a dev-only dependency, follows the same principle for CI integrity — an unmaintained Storybook version will accumulate unpatched CVEs in its dependency tree that flag in `npm audit`, even though they have no consumer exposure.

---

## 11. Next Steps

1. Add FR-040–046 and C-009 to the mission spec
2. Add security posture policy and dependency governance rule to the charter
3. Record Actions SHA pinning as a CI scaffold requirement in ADR-004 (or a new ADR-005)
4. Verify `@spec-kitty` npm scope ownership as the first pre-flight check before any CI publishing work begins
5. Cross-reference with SK issue #338 (CI test suite language-agnostic requirement) — the Playwright tests already anticipated this; the security suite should follow the same principle

Handoff from Architect Alphonso: these controls must be wired into the CI scaffold during implementation. They are not optional post-launch additions.
