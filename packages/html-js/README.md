# @spec-kitty/html-js

Framework-agnostic HTML primitives and ES utilities for the Spec Kitty design system.
No Angular, no React, no Vue required.

## Installation

**npm**:
```bash
npm install @spec-kitty/html-js @spec-kitty/tokens
```

**CDN (zero build step)**:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@spec-kitty/tokens/dist/tokens.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@spec-kitty/html-js/dist/src/index.js"></script>
```

## Usage

```typescript
import { SkStubHTML } from '@spec-kitty/html-js';

document.querySelector('#app').innerHTML = SkStubHTML;
```

Or with CSS loaded separately:
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="node_modules/@spec-kitty/tokens/dist/tokens.css">
  </head>
  <body id="app"></body>
  <script type="module">
    import { SkStubHTML } from '@spec-kitty/html-js';
    document.getElementById('app').innerHTML = SkStubHTML;
  </script>
</html>
```

## Peer dependencies

| Package | Required version |
|---|---|
| `@spec-kitty/tokens` | `^1.0.0` (or load via CDN) |

## See also

- [Token package](../tokens/README.md)
- [Component catalog](https://stijn-dejongh.github.io/spec-kitty-design/) (Storybook)
- [Contributing guide](../../docs/contributing/adding-a-component.md)
