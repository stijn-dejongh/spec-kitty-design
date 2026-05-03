# Architecture diagram assets

Mermaid sources and rendered SVGs for the diagrams referenced from the SAD-lite,
context canvas, and ADRs. Every `*.mmd` file here is paired with a `*.svg` that
must be regenerated whenever the source — or the shared brand theme — changes.

## Source-file invariant

Every `*.mmd` file in this directory starts with the placeholder `%%THEME%%` on
its own line, followed by a blank line, then the diagram body:

```
%%THEME%%

flowchart TB
    A --> B
```

**Never** add an inline `%%{init: …}%%` block to a source file. The render
script injects one, built from the brand-theme source. The render script
refuses to compile a source that violates this invariant.

## Brand-theme source

[`./sk-mermaid-theme.yaml`](./sk-mermaid-theme.yaml) is the **single source of
truth** for the brand-yellow border, dark background, edge label colour, and
font choice across every diagram in this directory. To rebrand, edit only this
file and regenerate every SVG.

The theme mirrors values from [`packages/tokens/src/tokens.css`](../../../packages/tokens/src/tokens.css).
Mermaid does not consume CSS custom properties, so values are duplicated here
intentionally; the diagram-CI gate is the safety net.

## Regenerating diagrams

After editing any `.mmd` file or the theme YAML, regenerate every SVG:

```bash
node scripts/render-diagrams.js
```

The script:

1. Loads `sk-mermaid-theme.yaml` and builds the inline `%%{init}%%` block.
2. For each `*.mmd` file in this directory, replaces `%%THEME%%` with the inline
   init block, writes a temp file under your OS temp dir, runs `mmdc` against
   it, and writes the resulting `*.svg` next to the source.
3. Lightly normalizes the SVG output (rounds float literals to 3 decimals) so
   re-renders that produce only cosmetic float jitter yield zero git diff.

Mermaid CLI (`mmdc`) must be on `PATH` or installed under
`node_modules/.bin/`. WP06 pins it as a `devDependency`; until then a global
install (`npm install -g @mermaid-js/mermaid-cli`) works.

`puppeteer-config.json` in this directory configures the headless browser
`mmdc` uses; it currently points at `/usr/bin/chromium`, which is the path
provided in CI. Local contributors with a different chromium location can
temporarily edit the path or rely on the puppeteer-bundled Chrome.

## Verifying before pushing

```bash
node scripts/render-diagrams.js --check
```

Renders each diagram into a temp directory, then byte-compares the rendered
output against the committed SVG (after a small normalization pass that
fingerprints `<path d="…">` attributes by their command structure — Mermaid's
bezier-control-point reordering does not flap the gate, but any meaningful
change to a diagram does). Exits non-zero with a per-file diff summary on
the first mismatch.

This is the same command CI runs (forward-reference: WP06 owns
`.github/workflows/docs-diagrams.yml`).

## Failure modes the gate catches

| Scenario | Outcome |
|---|---|
| Edit a `.mmd` without re-rendering its `.svg` | Gate fails; PR blocked. |
| Edit `sk-mermaid-theme.yaml` without re-rendering all dependent SVGs | Gate fails; PR blocked. |
| Add a new `.mmd` without committing the paired `.svg` | Gate fails; PR blocked. |
| Delete a `.mmd` but leave the `.svg` orphan | Gate passes with `WARN  orphan SVG …` in the summary. |
| Source file missing `%%THEME%%` placeholder | Gate fails immediately with diagnostic. |
| Source file contains an inline `%%{init}%%` block | Gate fails immediately with diagnostic. |
