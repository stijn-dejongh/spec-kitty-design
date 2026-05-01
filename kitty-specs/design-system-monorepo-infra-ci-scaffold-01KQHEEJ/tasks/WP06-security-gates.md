---
work_package_id: WP06
title: Security Gates & Dependency Hardening
dependencies:
- WP01
requirement_refs:
- FR-040
- FR-041
- FR-042
- FR-043
- FR-046
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T033
- T034
- T035
- T036
- T037
- T038
agent: "claude:claude-sonnet-4-6:implementer-ivan:implementer"
shell_pid: "2864832"
history:
- date: '2026-05-01'
  event: created
agent_profile: implementer-ivan
authoritative_surface: .github/dependabot.yml
execution_mode: code_change
owned_files:
- .github/dependabot.yml
- scripts/npm-audit-gate.sh
- scripts/check-action-pins.sh
- packages/tokens/.npmignore
- packages/angular/.npmignore
- packages/html-js/.npmignore
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load implementer-ivan
```

---

## Objective

Implement the supply chain security control layer: Dependabot configuration, npm audit gate script, lockfile integrity check, GitHub Actions SHA pin verifier, and per-package dist contents policy. All controls documented in ADR-005.

## Subtask Guidance

### T033 — `dependabot.yml`

**`.github/dependabot.yml`**:
```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "06:00"
    groups:
      angular:
        patterns: ["@angular/*", "@nx/angular*", "zone.js"]
      storybook:
        patterns: ["@storybook/*", "storybook"]
      playwright:
        patterns: ["@playwright/*"]
      nx:
        patterns: ["@nx/*", "nx"]
      lint-tools:
        patterns: ["eslint*", "stylelint*", "@typescript-eslint*", "htmlhint", "commitlint*"]
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
    open-pull-requests-limit: 10
    commit-message:
      prefix: "chore(deps)"

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "06:00"
    open-pull-requests-limit: 5
    commit-message:
      prefix: "chore(ci)"
```

**Rationale (ADR-005)**: major bumps excluded from auto-merge; major version evaluation is manual. Framework families grouped to reduce PR noise.

### T034 — `scripts/npm-audit-gate.sh`

```bash
#!/usr/bin/env bash
# npm-audit-gate.sh — fails if any high or critical CVE is found
# Used in CI (FR-041) and as a local quality check
set -euo pipefail

echo "Running npm audit..."
OUTPUT=$(npm audit --audit-level=high --json 2>&1 || true)

VULNERABILITIES=$(echo "$OUTPUT" | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const counts = d.metadata?.vulnerabilities || {};
const high = (counts.high || 0) + (counts.critical || 0);
process.stdout.write(String(high));
")

if [ "$VULNERABILITIES" -gt 0 ]; then
  echo "❌ npm audit found $VULNERABILITIES high/critical vulnerabilities. Fix before merging."
  npm audit --audit-level=high
  exit 1
else
  echo "✅ npm audit passed — no high/critical vulnerabilities."
fi
```

Make executable: `chmod +x scripts/npm-audit-gate.sh`

### T035 — Lockfile drift check

No separate script needed — `npm ci` itself fails when lockfile is out of sync.

Add a `package.json` script for explicit checking:
```json
"security:lockfile-check": "npm ci --dry-run --ignore-scripts 2>&1 | grep -i 'up to date' || (echo 'Lockfile drift detected. Run npm install and commit package-lock.json.' && exit 1)"
```

Also add a `scripts/assert-lockfile-clean.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
# Run after `npm install` to detect if lockfile would change
git diff --exit-code package-lock.json || {
  echo "❌ package-lock.json has uncommitted changes. Commit the updated lockfile."
  exit 1
}
echo "✅ package-lock.json is clean."
```

### T036 — `scripts/check-action-pins.sh`

```bash
#!/usr/bin/env bash
# check-action-pins.sh — detects mutable @v* tags in GitHub Actions workflows
# All `uses:` directives must be pinned to a full commit SHA (FR-043, ADR-005)
set -euo pipefail

WORKFLOWS_DIR=".github/workflows"
FAILED=0

for file in "$WORKFLOWS_DIR"/*.yml; do
  while IFS= read -r line; do
    # Match `uses: owner/repo@v*` (mutable tag — NOT a SHA)
    if echo "$line" | grep -qE 'uses:\s+[^@]+@v[0-9]'; then
      echo "❌ Mutable tag in $file: $line"
      FAILED=1
    fi
  done < "$file"
done

if [ "$FAILED" -eq 1 ]; then
  echo ""
  echo "Pin all GitHub Actions to commit SHAs. Example:"
  echo "  uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2"
  exit 1
fi
echo "✅ All GitHub Actions are pinned to commit SHAs."
```

Make executable: `chmod +x scripts/check-action-pins.sh`

### T037 — Package dist contents policy (`.npmignore` for all three packages)

Each publishable package must exclude source files, test files, and build tooling from published artifacts.
**Note:** `packages/tokens/` is a pure CSS package — it has no `ng-package.json` and no Angular build pipeline. Its dist policy is enforced via `.npmignore` only.

**`packages/tokens/.npmignore`**:
```
src/
*.map
*.md.bak
node_modules/
```

**`packages/angular/.npmignore`**:
```
src/
*.spec.ts
*.stories.ts
*.map
node_modules/
```

**`packages/html-js/.npmignore`**:
```
src/
*.spec.ts
*.stories.ts
*.map
node_modules/
```

**Note**: Using `files` array in `package.json` is the preferred alternative, but `.npmignore` provides belt-and-suspenders protection.

### T038 — Validate `npm pack --dry-run` for tokens

```bash
cd packages/tokens
npm pack --dry-run 2>&1 | grep -v "^npm notice"
# Must list: tokens.css, token-catalogue.json, README.md
# Must NOT list: src/*, *.map, node_modules/
```

If unexpected files appear, tighten `.npmignore` or `files` array and re-run.

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `.github/dependabot.yml` present with npm + Actions configs, grouped by framework
- [ ] `scripts/npm-audit-gate.sh` executable; exits 1 when high CVE found
- [ ] `scripts/check-action-pins.sh` executable; exits 1 on mutable `@v*` tags
- [ ] `.npmignore` present for all three publishable packages
- [ ] `npm pack --dry-run` for tokens shows only `tokens.css`, `token-catalogue.json`, `README.md`

## Reviewer Guidance

Run `bash scripts/check-action-pins.sh` — must exit 0 (all workflows SHA-pinned by the time this WP is merged). Test the audit gate: temporarily add a known-vulnerable package and confirm the script fails.

## Activity Log

- 2026-05-01T17:53:27Z – claude:claude-sonnet-4-6:implementer-ivan:implementer – shell_pid=2864832 – Started implementation via action command
- 2026-05-01T17:55:24Z – claude:claude-sonnet-4-6:implementer-ivan:implementer – shell_pid=2864832 – Dependabot config, security scripts, .npmignore files created
