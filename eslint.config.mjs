import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

const tsRulesBase = {
	plugins: {
		'@typescript-eslint': typescriptEslint
	},
	languageOptions: {
		parser: tsParser,
		ecmaVersion: 5,
		sourceType: 'module',

		parserOptions: {
			project: 'tsconfig.json'
		}
	}
};

export default [
	...compat.extends(
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier'
	),
	{ignores: ['coverage/*', 'dist/*', '*.mjs', '*.js']}, // global ignores
	{
		...tsRulesBase,
		rules: {
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/interface-name-prefix': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',

			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: false
				}
			],

			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'after-used',
					argsIgnorePattern: '^_',
					vars: 'all',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true
				}
			],

			'@typescript-eslint/array-type': [
				'warn',
				{
					default: 'generic'
				}
			],

			'@typescript-eslint/no-unnecessary-condition': 'error',

			quotes: [
				'error',
				'single',
				{
					avoidEscape: true
				}
			],

			camelcase: 'error',

			'no-console': [
				'error',
				{
					allow: ['info', 'warn', 'error']
				}
			],

			'no-else-return': 'error',
			'no-var-requires': 0,
			'no-unreachable': 'error',
			'object-shorthand': ['error', 'always'],
			'no-negated-condition': 'error',
			'no-return-await': 'off',
			'@typescript-eslint/return-await': 'error',
			'@typescript-eslint/promise-function-async': ['error'],
			'@typescript-eslint/member-ordering': 'warn',
			'@typescript-eslint/switch-exhaustiveness-check': 'error'
		}
	},
	{
		// ...tsRulesBase,
		files: ['src/**/*snapshot.spec.ts'],
		rules: {
			'@typescript-eslint/ban-ts-comment': 'off'
		}
	},
	{
		files: ['**/*.js'],

		rules: {
			'@typescript-eslint/no-var-requires': 'off'
		}
	}
];
