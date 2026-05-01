# @spec-kitty/angular

Angular LTS component library for the Spec Kitty design system.

## Installation

```bash
npm install @spec-kitty/angular @spec-kitty/tokens
```

## Usage

1. Load the token CSS in your global styles or `angular.json`:
   ```json
   "styles": ["node_modules/@spec-kitty/tokens/dist/tokens.css"]
   ```

2. Import components:
   ```typescript
   import { SkStubComponent } from '@spec-kitty/angular';
   ```

3. Declare in your standalone component or NgModule imports:
   ```typescript
   @Component({
     standalone: true,
     imports: [SkStubComponent],
     template: `<sk-stub></sk-stub>`,
   })
   export class MyPage {}
   ```

## Peer dependencies

| Package | Required version |
|---|---|
| `@angular/core` | `>=19.0.0 <20.0.0` |
| `@spec-kitty/tokens` | `^1.0.0` |

## Token dependency

This package consumes `--sk-*` CSS custom properties from `@spec-kitty/tokens`.
All components reference tokens by name — no values are hardcoded in this package.
If tokens are not loaded, components will render without styles.

## See also

- [Token package](../tokens/README.md)
- [Component catalog](https://stijn-dejongh.github.io/spec-kitty-design/) (Storybook)
- [Contributing guide](../../docs/contributing/adding-a-component.md)
