/**
 * Shared eslint config for Vue3
 * https://eslint.org/docs/latest/
 *
 */

/** @type {import('eslint').ESLint.ConfigData}  */
module.exports = {
  extends: [
    '../config/eslint-config-vue-base.cjs',
    'plugin:vue/vue3-recommended',
  ],
  rules: {
    'vue/no-reserved-component-names': 'error',
  },
  overrides: [
    {
      // Pages and layouts are required to have a single root element if transitions are enabled.
      // https://github.com/nuxt/eslint-config/blob/main/packages/eslint-config/index.js#L77
      files: [
        '**/pages/**/*.{js,ts,jsx,tsx,vue}',
        '**/layouts/**/*.{js,ts,jsx,tsx,vue}',
      ],
      rules: { 'vue/no-multiple-template-root': 'error' },
    },
  ],
}
