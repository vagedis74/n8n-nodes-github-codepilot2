module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	env: {
		node: true,
		es6: true,
	},
	rules: {
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
	},
	ignorePatterns: ['dist/', 'node_modules/', '*.js'],
};
