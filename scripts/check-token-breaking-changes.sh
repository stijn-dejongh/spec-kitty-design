#!/usr/bin/env bash
# check-token-breaking-changes.sh — detects removed or renamed --sk-* tokens
# between the current HEAD and a previous git tag or commit.
#
# Usage:
#   bash scripts/check-token-breaking-changes.sh              # compare to previous tag
#   bash scripts/check-token-breaking-changes.sh v0.1.0       # compare to specific tag
#
# FR-015: breaking token name changes must be blocked without a major version bump.
# This script is the manual enforcement mechanism until automated CI is added.
#
# Exit codes:
#   0 — no breaking changes (no tokens removed from the current catalogue)
#   1 — breaking changes detected (tokens present in previous version are missing now)
#   2 — cannot compare (previous tag not found or catalogue not generated yet)
set -euo pipefail

CATALOGUE_PATH="packages/tokens/dist/token-catalogue.json"
PREVIOUS_REF="${1:-}"

# ── Resolve the reference to compare against ─────────────────────────────────

if [ -z "$PREVIOUS_REF" ]; then
  # No argument: find the most recent tag
  PREVIOUS_REF=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
  if [ -z "$PREVIOUS_REF" ]; then
    echo "⚠  No previous tag found. Cannot detect breaking changes — this may be the first release."
    echo "   Once you create your first tag (e.g. v1.0.0), future runs will compare against it."
    exit 0
  fi
  echo "Comparing against previous tag: $PREVIOUS_REF"
else
  echo "Comparing against: $PREVIOUS_REF"
fi

# ── Check current catalogue exists ───────────────────────────────────────────

if [ ! -f "$CATALOGUE_PATH" ]; then
  echo "❌ Token catalogue not found at $CATALOGUE_PATH."
  echo "   Run: npm run tokens:catalogue"
  exit 2
fi

# ── Extract previous catalogue from git history ───────────────────────────────

PREVIOUS_CATALOGUE=$(git show "${PREVIOUS_REF}:${CATALOGUE_PATH}" 2>/dev/null || echo "")

if [ -z "$PREVIOUS_CATALOGUE" ]; then
  echo "⚠  ${CATALOGUE_PATH} not found at ref ${PREVIOUS_REF}."
  echo "   Either the file didn't exist at that ref or the ref is invalid."
  echo "   Skipping breaking change check."
  exit 0
fi

# ── Extract token names from both versions ────────────────────────────────────

CURRENT_TOKENS=$(node -e "
const d = require('./${CATALOGUE_PATH}');
const tokens = Object.values(d.categories).flatMap(c => c.tokens).sort();
tokens.forEach(t => console.log(t));
")

PREVIOUS_TOKENS=$(node -e "
const d = JSON.parse($(printf '%s' "$PREVIOUS_CATALOGUE" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  const s = JSON.stringify(Buffer.concat(chunks).toString());
  console.log(s);
});
"));
const tokens = Object.values(d.categories).flatMap(c => c.tokens).sort();
tokens.forEach(t => console.log(t));
" 2>/dev/null || echo "$PREVIOUS_CATALOGUE" | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
const tokens = Object.values(d.categories).flatMap(c => c.tokens).sort();
tokens.forEach(t => console.log(t));
")

# ── Find removed tokens ────────────────────────────────────────────────────────

REMOVED=$(comm -23 \
  <(echo "$PREVIOUS_TOKENS" | sort) \
  <(echo "$CURRENT_TOKENS" | sort))

ADDED=$(comm -13 \
  <(echo "$PREVIOUS_TOKENS" | sort) \
  <(echo "$CURRENT_TOKENS" | sort))

# ── Report ────────────────────────────────────────────────────────────────────

if [ -n "$ADDED" ]; then
  echo "✅ New tokens added (non-breaking):"
  echo "$ADDED" | sed 's/^/   + /'
fi

if [ -z "$REMOVED" ]; then
  echo "✅ No tokens removed — no breaking changes detected."
  exit 0
fi

echo ""
echo "❌ BREAKING CHANGE: the following tokens were removed or renamed:"
echo "$REMOVED" | sed 's/^/   - /'
echo ""
echo "Removed token names constitute a breaking change (ADR-003, FR-015)."
echo "Required action before publishing:"
echo "  1. If this is intentional: bump the major version in all packages."
echo "  2. If this is accidental: restore the removed tokens."
echo "  3. Record the change in CHANGELOG.md and ADR-003 addendum."
exit 1
