---
affected_files: []
cycle_number: 4
mission_slug: design-system-monorepo-infra-ci-scaffold-01KQHEEJ
reproduction_command:
reviewed_at: '2026-05-01T17:59:34Z'
reviewer_agent: unknown
verdict: rejected
wp_id: WP06
---

# WP06 Review Cycle 1 — Reviewer: Renata

**Date:** 2026-05-01
**Status:** Changes Requested

---

## Summary

The overall implementation is solid. `dependabot.yml`, `npm-audit-gate.sh`, `assert-lockfile-clean.sh`, and all three `.npmignore` files match the spec exactly and are correct. All scripts have executable bits set. One blocking defect exists in `scripts/check-action-pins.sh`.

---

## Issues

### Issue 1 (Blocking) — `scripts/check-action-pins.sh` fails with a misleading error when `.github/workflows/` does not exist

**File:** `scripts/check-action-pins.sh`

**Problem:** The script uses a `for file in "$WORKFLOWS_DIR"/*.yml` glob combined with `while IFS= read -r line ... done < "$file"`. When `.github/workflows/` does not exist (which is the case before WP07 runs), bash expands the glob to the literal string `.github/workflows/*.yml`, and the subsequent `done < "$file"` redirect fails with:

```
scripts/check-action-pins.sh: line 9: .github/workflows/*.yml: No such file or directory
```

The script exits 1 for the wrong reason. The reviewer guidance explicitly states: "Run `bash scripts/check-action-pins.sh` — must exit 0 (all workflows SHA-pinned by the time this WP is merged)." Currently it exits 1.

In CI, when this script runs before any workflow files exist, it will produce a false failure that blocks the pipeline with no actionable error message.

**How to fix:** Add an early-exit guard at the top of the loop body to handle the case where the workflows directory does not exist or contains no `.yml` files:

```bash
#!/usr/bin/env bash
# check-action-pins.sh — detects mutable @v* tags in GitHub Actions workflows
# All `uses:` directives must be pinned to a full commit SHA (FR-043, ADR-005)
set -euo pipefail

WORKFLOWS_DIR=".github/workflows"
FAILED=0

if [ ! -d "$WORKFLOWS_DIR" ]; then
  echo "✅ No workflows directory found — nothing to check."
  exit 0
fi

shopt -s nullglob
workflow_files=("$WORKFLOWS_DIR"/*.yml)
shopt -u nullglob

if [ ${#workflow_files[@]} -eq 0 ]; then
  echo "✅ No workflow files found — nothing to check."
  exit 0
fi

for file in "${workflow_files[@]}"; do
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

---

## What Passed

- `.github/dependabot.yml`: npm + Actions ecosystems configured, all framework groups present, major version bumps excluded (`version-update:semver-major`), weekly Monday schedule, correct commit-message prefixes. Matches spec exactly.
- `scripts/npm-audit-gate.sh`: Executable, uses `set -euo pipefail`, correctly parses JSON audit output via node, exits 1 on high/critical CVE count > 0, exits 0 otherwise.
- `scripts/assert-lockfile-clean.sh`: Executable, correct `||` pattern under `set -euo pipefail`, detects uncommitted lockfile changes.
- `packages/tokens/.npmignore`: Excludes `src/`, `*.map`, `*.md.bak`, `node_modules/`.
- `packages/angular/.npmignore`: Excludes `src/`, `*.spec.ts`, `*.stories.ts`, `*.map`, `node_modules/`.
- `packages/html-js/.npmignore`: Excludes `src/`, `*.spec.ts`, `*.stories.ts`, `*.map`, `node_modules/`.
- All three scripts have `rwxrwxr-x` permissions confirmed via `ls -la scripts/`.
