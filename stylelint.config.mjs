// Formatting only: ESLint Stylistic covers JS, TS and templates, and this does
// the same job for CSS, including `<style>` blocks in Vue files.
export default {
  extends: ['stylelint-config-html/vue', '@stylistic/stylelint-config'],
  rules: {
    // Match the existing CSS: single quotes, and hex colours in capitals as in
    // the design tokens.
    '@stylistic/string-quotes': 'single',
    '@stylistic/color-hex-case': 'upper',
    '@stylistic/number-no-trailing-zeros': null,
    // Short selector lists such as `ul, ol` can stay on one line.
    '@stylistic/selector-list-comma-newline-after': 'always-multi-line',
  },
}
