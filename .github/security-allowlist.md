# Security Allowlist — Postinstall Script Exceptions

This file documents every npm package that has been explicitly reviewed
and approved to run postinstall/install/prepare lifecycle scripts.
CI enforces `npm ci --ignore-scripts`; any package that requires a
postinstall hook must be listed here with rationale.

## Approved exceptions

| Package | Script purpose | Reviewed by | Date | Expiry review |
|---|---|---|---|---|
| (none at v1.0.0) | | | | |
| surge | Global install for PR preview deployment; postinstall is empty for surge | node-norris | 2026-05-01 | Annual |

## Adding an exception

1. Review the postinstall script source on the package's GitHub repo
2. Confirm it only performs legitimate setup (native module compilation, font download, etc.)
3. Add a row to the table above with your name and the date
4. Add the package to `npm install --ignore-scripts` exception in `ci-quality.yml`
