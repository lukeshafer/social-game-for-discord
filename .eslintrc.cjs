/** @type {import('eslint').Linter.Config} */
module.exports = {
	plugins: [
		"@typescript-eslint",
		"solid",
		"eslint-plugin-tsdoc",
		//"jsx-a11y"
	],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:solid/typescript",
		"plugin:astro/recommended",
		//"plugin:jsx-a11y/strict",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		tsconfigRootDir: ".",
		project: ["tsconfig.json"],
	},
	root: true,
	rules: {
		"tsdoc/syntax": "warn",
	},

	overrides: [
		{
			// Config for `.astro` files
			files: ["*.astro"],
			parser: "astro-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
				extraFileExtensions: [".astro"],
			},
		},
		{
			// Remove some rules from typescript eslint which conflict with solid
			files: ["*.astro", "*.ts", "*.tsx"],
			rules: {
				// below are the default rules for TS for reference
				// uncomment and change to override
				"@typescript-eslint/no-non-null-assertion": "off", // default: "warn"
				//'@typescript-eslint/adjacent-overload-signatures': 'error',
				//'@typescript-eslint/ban-ts-comment': 'error',
				//'@typescript-eslint/ban-types': 'error',
				//'no-array-constructor': 'off',
				//'@typescript-eslint/no-array-constructor': 'error',
				//'no-empty-function': 'off',
				//'@typescript-eslint/no-empty-function': 'error',
				//'@typescript-eslint/no-empty-interface': 'error',
				//'@typescript-eslint/no-explicit-any': 'warn',
				//'@typescript-eslint/no-extra-non-null-assertion': 'error',
				//'no-extra-semi': 'off',
				//'@typescript-eslint/no-extra-semi': 'error',
				//'@typescript-eslint/no-inferrable-types': 'error',
				//'no-loss-of-precision': 'off',
				//'@typescript-eslint/no-loss-of-precision': 'error',
				//'@typescript-eslint/no-misused-new': 'error',
				//'@typescript-eslint/no-namespace': 'error',
				//'@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
				//'@typescript-eslint/no-non-null-assertion': 'warn',
				//'@typescript-eslint/no-this-alias': 'error',
				//'@typescript-eslint/no-unnecessary-type-constraint': 'error',
				//'no-unused-vars': 'off',
				//'@typescript-eslint/no-unused-vars': 'warn',
				//'@typescript-eslint/no-var-requires': 'error',
				//'@typescript-eslint/prefer-as-const': 'error',
				//'@typescript-eslint/prefer-namespace-keyword': 'error',
				//'@typescript-eslint/triple-slash-reference': 'error',
			},
		},
	],
	// (jsx-a11y) To enable your custom components to be checked as
	// DOM elements, you can set global settings in your configuration file by
	// mapping each custom component name to a DOM element type.
	// settings: {
	// 	"jsx-a11y": {
	// 		components: {
	// 			CityInput: "input",
	// 			CustomButton: "button",
	// 			MyButton: "button",
	// 			RoundButton: "button",
	// 		},
	// 	},
	// },
};
