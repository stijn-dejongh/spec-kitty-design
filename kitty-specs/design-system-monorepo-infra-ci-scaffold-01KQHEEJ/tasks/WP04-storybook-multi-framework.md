---
work_package_id: WP04
title: Storybook Multi-Framework Setup
dependencies:
- WP03
requirement_refs:
- FR-006
- FR-007
- FR-008
- FR-009
- FR-011
- FR-031
- NFR-003
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T021
- T022
- T023
- T024
- T025
- T026
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "3240799"
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: apps/storybook/.storybook/
execution_mode: code_change
owned_files:
- apps/storybook/.storybook/main.ts
- apps/storybook/.storybook/preview.ts
- apps/storybook/src/stories/getting-started.mdx
- apps/storybook/package.json
- apps/storybook/project.json
- packages/angular/src/lib/stub/sk-stub.stories.ts
- packages/html-js/src/stub/sk-stub-html.stories.ts
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Configure Storybook 8.x with the `@nx/storybook` executor to render Angular components and HTML primitives from a single catalog, build to a static site for GitHub Pages, and include the Getting Started consumer page (FR-031). The build must complete in < 3 minutes (NFR-003).

## Context

- FR-006: single Storybook catalog for all components across framework targets
- FR-007: Angular and plain HTML renderers from a single story entry
- FR-008: each story covers default, interactive states, and two responsive breakpoints
- FR-031: "Getting Started" page for consumers
- Research (WP04 research note): Storybook 8.x supports multiple frameworks via `storiesOf` with framework parameter, or via separate story files with a naming convention. If same-page multi-framework tabs are not achievable in a single story file, the fallback is `SkStub.stories.ts` (Angular) + `SkStub.html.stories.ts` (HTML) with naming convention `ComponentName (Angular)` and `ComponentName (HTML)`.

## Subtask Guidance

### T021 — Install and configure Storybook 8.x

```bash
npx nx g @nx/storybook:configuration storybook \
  --uiFramework=@storybook/angular \
  --project=storybook \
  --configDir=apps/storybook/.storybook
```

Then add `@storybook/html` renderer to `apps/storybook/package.json`:
```json
{
  "devDependencies": {
    "@storybook/angular": "^8.0.0",
    "@storybook/html": "^8.0.0",
    "@storybook/addon-essentials": "^8.0.0",
    "@storybook/addon-a11y": "^8.0.0",
    "@storybook/test": "^8.0.0"
  }
}
```

**`apps/storybook/.storybook/main.ts`**:
```typescript
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../../packages/**/*.stories.@(ts|tsx)',
    '../../packages/**/*.stories.html.ts',
    '../src/**/*.mdx',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: { autodocs: 'tag' },
};

export default config;
```

### T022 — Configure `preview.ts`

**`apps/storybook/.storybook/preview.ts`**:
```typescript
import type { Preview } from '@storybook/angular';

// Load SK tokens for all stories
import '@spec-kitty/tokens';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'sk-dark',
      values: [
        { name: 'sk-dark',  value: '#0A0A0B' },
        { name: 'sk-card',  value: '#161619' },
        { name: 'sk-light', value: '#ffffff' },
      ],
    },
    a11y: {
      config: { rules: [{ id: 'color-contrast', enabled: true }] },
    },
    layout: 'centered',
  },
};

export default preview;
```

**Note**: `import '@spec-kitty/tokens'` loads the CSS file — this requires the tokens package to be built first (handled by nx `dependsOn: ["^build"]`).

### T023 — Angular stub story

**`packages/angular/src/lib/stub/sk-stub.stories.ts`**:
```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { SkStubComponent } from './sk-stub.component';

const meta: Meta<SkStubComponent> = {
  title: 'Primitives/SkStub (Angular)',
  component: SkStubComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
  },
};

export default meta;
type Story = StoryObj<SkStubComponent>;

export const Default: Story = {};

export const OnLightBackground: Story = {
  parameters: { backgrounds: { default: 'sk-light' } },
};

// Responsive breakpoint stories
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
```

### T024 — HTML stub story

**`packages/html-js/src/stub/sk-stub-html.stories.ts`**:
```typescript
import type { Meta, StoryObj } from '@storybook/html';
import { SkStubHTML } from './index';

const meta: Meta = {
  title: 'Primitives/SkStub (HTML)',
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
  render: () => SkStubHTML,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
```

### T025 — Getting Started MDX page (FR-031)

**`apps/storybook/src/stories/getting-started.mdx`**:
```mdx
import { Meta } from '@storybook/blocks';

<Meta title="Getting Started" />

# Getting Started with Spec Kitty Design System

## Installation

**Token package (zero build-step)**

\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@spec-kitty/tokens/dist/tokens.css">
\`\`\`

or via npm:
\`\`\`bash
npm install @spec-kitty/tokens
\`\`\`

**Angular components**
\`\`\`bash
npm install @spec-kitty/angular @spec-kitty/tokens
\`\`\`

## Using tokens in your CSS

Once the token file is loaded, reference \`--sk-*\` custom properties:
\`\`\`css
.my-button {
  background: var(--sk-color-yellow);
  color: var(--sk-fg-on-primary);
  border-radius: var(--sk-radius-pill);
  padding: var(--sk-space-2) var(--sk-space-6);
}
\`\`\`

## Token catalogue

See the full list of available tokens in the
[token catalogue](https://cdn.jsdelivr.net/npm/@spec-kitty/tokens/dist/token-catalogue.json).

## Semantic pairing rule

Always pair surface tokens with their foreground counterpart:
| Surface | Use with |
|---|---|
| `--sk-surface-page` | `--sk-fg-default` |
| `--sk-surface-card` | `--sk-fg-on-card` |
| `--sk-color-yellow` (CTA) | `--sk-fg-on-primary` |
```

### T026 — Verify build time (NFR-003)

```bash
time npx nx run storybook:storybook:build
# Must complete in < 3 minutes (180 seconds)
```

If > 3 min, check for large assets being processed and consider disabling story source code display for the stub.

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `apps/storybook/.storybook/main.ts` renders Angular + HTML stories
- [ ] `preview.ts` sets SK dark background and enables a11y addon
- [ ] Angular stub story has Default, OnLightBackground, Mobile, Desktop exports
- [ ] HTML stub story has Default, Mobile, Desktop exports
- [ ] Getting Started MDX page present and renders (FR-031)
- [ ] `npx nx run storybook:storybook:build` exits 0 in < 3 min (NFR-003)

## Risks

- Storybook 8.x `@storybook/html` renderer in the same config as `@storybook/angular` may require `multiConfig` — check Storybook 8 migration guide
- If `import '@spec-kitty/tokens'` in `preview.ts` fails (CSS import in TS), use Storybook's `staticDirs` config to serve the token CSS file as a static asset instead

## Reviewer Guidance

Open the built Storybook (`apps/storybook/storybook-static/`). Both "SkStub (Angular)" and "SkStub (HTML)" stories must render on dark background with the Getting Started page accessible from the sidebar.

## Activity Log

- 2026-05-01T18:53:07Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=3105699 – Started implementation via action command
- 2026-05-01T19:15:25Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=3105699 – Storybook 10.x configured for Angular + HTML renderers with working build. ADR-006 fallback used: separate story files with (Angular)/(HTML) naming convention. Build completes in ~10s. Key adaptations: (1) Storybook 10.x used instead of 8.x due to Angular 21 incompatibility with SB8, (2) angular.json added for angularBrowserTarget requirement, (3) story paths use 3-level traversal from .storybook/ to workspace packages/, (4) addon-essentials replaced by addon-docs in 10.x, (5) autodocs type changed to defaultName in DocsOptions.
- 2026-05-01T19:22:01Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=3222704 – Started review via action command
- 2026-05-01T19:23:57Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=3222704 – Moved to planned
- 2026-05-01T19:25:04Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=3235731 – Started implementation via action command
- 2026-05-01T19:25:57Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=3235731 – Cycle 2: stories excluded from tsconfig.lib.json in html-js and angular packages
- 2026-05-01T19:26:19Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=3240799 – Started review via action command
