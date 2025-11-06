import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-config-prettier'

export default [
    {
        ignores: ['dist/**', 'node_modules/**']
    },

    js.configs.recommended,

    ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
        ...cfg,
        files: ['**/*.ts'],
        languageOptions: {
            ...cfg.languageOptions,
            parserOptions: {
                ...cfg.languageOptions?.parserOptions,
                projectService: true,
                tsconfigRootDir: process.cwd()
            }
        }
    })),


    {
        files: ['**/*.ts'],
        plugins: { import: importPlugin },
        rules: {

            'import/order': ['warn', { 'newlines-between': 'always' }],


            '@typescript-eslint/no-misused-promises': [
                'error',
                { checksVoidReturn: { attributes: false } }
            ]
        }
    },


    prettier
]