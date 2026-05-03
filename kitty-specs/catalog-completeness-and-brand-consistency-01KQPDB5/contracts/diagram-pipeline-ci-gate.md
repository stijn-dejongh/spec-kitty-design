# Contract: Diagram pipeline CI gate

**Mission**: `catalog-completeness-and-brand-consistency-01KQPDB5`
**Sources**: spec FR-013, FR-014, FR-015, FR-016, NFR-002; research PLAN-004, PLAN-005

This contract is the agreement that any implementation of the diagram render flow + CI gate must satisfy.

## Trigger contract

- **Workflow file**: `.github/workflows/docs-diagrams.yml`
- **Triggers**:
  - `pull_request` events that change any path under `docs/architecture/assets/**`
  - `push` to `main` for the same path filter
- **Does NOT trigger** on: changes outside `docs/architecture/assets/**`. A PR that does not touch diagrams pays zero CI cost from this workflow.

## Render-script behavioural contract

The render script (`scripts/render-diagrams.js`, invoked as `node scripts/render-diagrams.js [--check]`) MUST:

| Mode | Inputs | Outputs | Exit code |
|---|---|---|---|
| **Render mode** (no flag) | `docs/architecture/assets/sk-mermaid-theme.yaml`; every `*.mmd` file under `docs/architecture/assets/` | A `*.svg` file alongside each `*.mmd`, with the `%%THEME%%` placeholder in the source replaced by the inline `%%{init}%%` block built from the YAML | `0` on success; non-zero with stderr diagnostic on first failure |
| **Check mode** (`--check`) | Same inputs as render mode | Renders to a temporary directory, then byte-compares against the committed SVGs alongside the sources | `0` if all SVGs match the freshly rendered output; non-zero with a per-file diff summary on first mismatch |

### Local-CI parity (FR-016)

The script MUST produce identical output when invoked locally and in CI. Specifically:

- No CI-only flags or environment variables affect the rendered output.
- Mermaid CLI version is pinned in `package.json` so local and CI use the same renderer.
- The script does not depend on any non-portable filesystem paths or timing.

## CI gate behavioural contract

The CI job MUST:

1. Check out the PR head.
2. Install Node 20 + the pinned `@mermaid-js/mermaid-cli` from `package.json`.
3. Run `node scripts/render-diagrams.js --check`.
4. **If exit code is 0**: report success. The PR may merge from this gate's perspective.
5. **If exit code is non-zero**: fail the job with the script's stderr as the failure message. The failure message MUST identify which file(s) drifted and indicate the remediation (`run node scripts/render-diagrams.js locally and commit the regenerated SVGs`).

## Failure modes the gate explicitly catches

| Scenario | Detection | Outcome |
|---|---|---|
| Contributor edits a `.mmd` file without re-rendering its `.svg` (FR-014) | Check mode finds source-vs-rendered drift on that file | Gate fails; PR blocked until SVG regenerated |
| Contributor edits `sk-mermaid-theme.yaml` without re-rendering all dependent SVGs (FR-015) | Check mode finds drift on every diagram (since theme injection changes the inline `%%{init}%%` block) | Gate fails; PR blocked until all SVGs regenerated |
| Contributor adds a new `.mmd` file but forgets to commit a paired `.svg` | Check mode finds the new source has no committed SVG to compare against | Gate fails; PR blocked until SVG generated and committed |
| Contributor deletes a `.mmd` but leaves the orphaned `.svg` behind | Check mode reports orphaned-SVG warning (not failure — orphan is harmless if intentional, but flagged for cleanup) | Gate passes with warning in summary |

## Performance contract (NFR-002)

When triggered (i.e., the PR touches `docs/architecture/assets/**`), the gate's full job duration MUST be ≤ 60 s on the standard GitHub Actions runner (`ubuntu-latest`). This budget covers: Node setup, Mermaid CLI install (cached when possible), rendering 8 diagrams, and the byte-compare check.

When NOT triggered (most PRs), the gate adds 0 s to CI time.

## Configuration contract — what the workflow file MUST contain

Implementation freedom is preserved, but the workflow file MUST:

- Use a path filter that includes `docs/architecture/assets/**` (so the trigger is correctly scoped).
- Pin Node version (e.g. `actions/setup-node@v4` with `node-version: 20`).
- Install only what is needed (`npm ci --ignore-scripts` is fine; the existing pattern in `ci-quality.yml`).
- Run the render script in `--check` mode only (CI MUST NOT mutate committed SVGs).
- Use `actions/cache` for the npm/Mermaid installation to keep the 60 s budget.

## What this contract does NOT prescribe

- The exact YAML structure of the GitHub Actions workflow file (job names, step ordering, runner image, cache key strategy) — those are decided during implementation.
- The exact diff format the script emits when drift is detected — implementation choice.
- Whether the script is implemented in a single file or split into modules — implementation choice.
