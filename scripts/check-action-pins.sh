#!/usr/bin/env bash
# check-action-pins.sh — detects mutable @v* tags in GitHub Actions workflows
# All `uses:` directives must be pinned to a full commit SHA (FR-043, ADR-005)
set -euo pipefail

WORKFLOWS_DIR=".github/workflows"
FAILED=0

# Exit 0 gracefully if no workflows directory exists yet
if [ ! -d "$WORKFLOWS_DIR" ]; then
  echo "✅ No workflows directory found — nothing to check."
  exit 0
fi

# Use nullglob to handle empty directory gracefully
shopt -s nullglob
WORKFLOW_FILES=("$WORKFLOWS_DIR"/*.yml)
shopt -u nullglob

if [ ${#WORKFLOW_FILES[@]} -eq 0 ]; then
  echo "✅ No workflow files found — nothing to check."
  exit 0
fi

for file in "${WORKFLOW_FILES[@]}"; do
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
