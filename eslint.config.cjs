const tsPlugin = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const importPlugin = require('eslint-plugin-import')


module.exports = [

    {
        ignores: [
            'node_modules/**',
            '**/dist/**',
            '.next/**',
            'coverage/**',
            '**/*.map',
        ],
    },

    {
        files: ['**/*.{ts,tsx,js,cjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {},
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],

            'import/order': [
                'warn',
                { 'newlines-between': 'always', alphabetize: { order: 'asc', caseInsensitive: true } },
            ],
        },
    },

    require('eslint-config-prettier'),
]