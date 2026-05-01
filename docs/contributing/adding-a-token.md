# Adding a design token

Design tokens are CSS custom properties in `packages/tokens/src/tokens.css`.
The token catalogue (`packages/tokens/dist/token-catalogue.json`) is the
machine-readable source of truth for tooling and agents.

## When to add a token

Add a token when a new visual decision needs to be reusable across surfaces.
Do not add tokens for one-off values that are local to a single component.

## Naming convention (ADR-003)

Pattern: `--sk-<category>-<name>`

| Category | Prefix | Examples |
|---|---|---|
| Brand color | `--sk-color-` | `--sk-color-teal` |
| Surface | `--sk-surface-` | `--sk-surface-sidebar` |
| Foreground | `--sk-fg-` | `--sk-fg-on-sidebar` |
| Spacing | `--sk-space-` | `--sk-space-13` |
| Radius | `--sk-radius-` | `--sk-radius-xs` |

See [ADR-003](../architecture/decisions/2026-05-01-3-token-schema-naming-convention.md) for the
complete category table and naming rationale.

## Steps

1. **Add to `packages/tokens/src/tokens.css`** in the correct category block:
   ```css
   /* ── Brand Colors ── */
   --sk-color-teal: #4ECDC4;  /* add after existing colors */
   ```

2. **Regenerate the catalogue**:
   ```bash
   npm run tokens:catalogue
   ```

3. **Verify Stylelint passes** (the new token is now in the allowlist):
   ```bash
   npm run quality:stylelint
   ```

4. **Commit**:
   ```bash
   git commit -m "feat(tokens): add --sk-color-teal"
   ```

5. **Check file size** stays under 20 KB:
   ```bash
   wc -c packages/tokens/src/tokens.css  # < 20480
   ```

## Semantic pairing rule

If you add a surface token, also add its foreground counterpart.
`--sk-surface-sidebar` must have a paired `--sk-fg-on-sidebar`.

Using a surface token without its paired foreground token is a contract violation
under ADR-003 and will be flagged in component review.
