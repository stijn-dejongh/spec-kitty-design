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
