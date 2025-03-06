import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    ignores: ['src/composables/api/*'],
    rules: {
      'style/semi': 'off',
      'style/member-delimiter-style': 'off',
      'style/quotes': 'off',
      'style/brace-style': 'off',
      'style/operator-linebreak': 'off',
    },
  },
)
