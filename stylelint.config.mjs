import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Import the generated token catalogue to build the strict-value allowlist.
// Run `npx nx run tokens:catalogue` to regenerate after adding tokens.
let allTokens = [];
try {
  const tokenCatalogue = require('./packages/tokens/dist/token-catalogue.json');
  allTokens = Object.values(tokenCatalogue.categories).flatMap((c) => c.tokens);
} catch {
  // Catalogue not yet generated — fall back to pattern-only enforcement.
  // Run `npx nx run tokens:catalogue` to generate it.
}

/** @type {import('stylelint').Config} */
export default {
  plugins: ['stylelint-declaration-strict-value'],
  rules: {
    // Enforce usage of --sk-* CSS custom property tokens instead of hardcoded values.
    // When the token catalogue is present, only catalogued token names are allowed.
    'scale-unlimited/declaration-strict-value': [
      ['/color/', 'background', 'background-color', 'font-family', 'padding', 'margin', 'border-radius'],
      {
        ignoreValues: {
          '': [
            '/^var\\(--sk-/',
            'transparent',
            'inherit',
            'initial',
            'unset',
            'none',
            'currentColor',
            '0',
          ],
        },
        disableFix: true,
        message: 'Use a CSS custom property token (var(--sk-*)) instead of a hardcoded value.',
      },
    ],

    // All SK component class names must follow BEM with sk- prefix
    'selector-class-pattern': '^sk-[a-z][a-z0-9]*(__[a-z][a-z0-9]*)?(-{1,2}[a-z][a-z0-9]*)*$',

    // Standard CSS validity rules
    'color-no-invalid-hex': true,
    'unit-no-unknown': true,
    'property-no-unknown': true,
  },
  ignoreFiles: [
    // Token source file is exempt — it defines the tokens, not consumes them
    'packages/tokens/src/tokens.css',
    '**/dist/**',
    '**/storybook-static/**',
    '**/node_modules/**',
  ],
};

// Export the resolved token list for use by other tooling (e.g. IDE plugins).
export { allTokens };
