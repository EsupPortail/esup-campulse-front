import {withVueTs, vueTsConfigs} from '@vue/eslint-config-typescript'
import vueI18n from '@intlify/eslint-plugin-vue-i18n'
import oxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'

export default withVueTs(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'stats.html', 'maintenance/**'],
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  ...vueI18n.configs.recommended,
  {
    settings: {
      'vue-i18n': {
        localeDir: './src/locales/*.{json,json5,yaml,yml}',
        messageSyntaxVersion: '^11.0.0',
      },
    },
  },
  {
    rules: {
      indent: ['warn', 2],
      'no-console': 'off',
      'no-debugger': 'off',
      'object-curly-spacing': 'warn',
      quotes: ['warn', 'single'],
      semi: ['warn', 'never'],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
        },
      ],
      '@intlify/vue-i18n/no-unused-keys': [
        'warn',
        {
          extensions: ['.js', '.vue', '.ts'],
        },
      ],
      'vue/first-attribute-linebreak': 'warn',
      'vue/html-closing-bracket-newline': 'warn',
      'vue/html-indent': ['warn', 2],
      'vue/max-attributes-per-line': 'warn',
      'vue/multiline-html-element-content-newline': 'warn',
    },
  },
  // Désactive les règles ESLint déjà couvertes par oxlint, qui s'exécute avant.
  ...oxlint.configs['flat/recommended'],
)
