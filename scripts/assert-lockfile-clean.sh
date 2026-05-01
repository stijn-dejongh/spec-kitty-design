#!/usr/bin/env bash
set -euo pipefail
# Run after `npm install` to detect if lockfile would change
git diff --exit-code package-lock.json || {
  echo "❌ package-lock.json has uncommitted changes. Commit the updated lockfile."
  exit 1
}
echo "✅ package-lock.json is clean."
