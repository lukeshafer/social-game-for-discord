import { defineConfig } from 'astro/config';
import { ecsstatic } from '@acab/ecsstatic/vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// https://astro.build/config
import solidJs from '@astrojs/solid-js';
import aws from 'astro-sst/lambda';

// https://astro.build/config
export default defineConfig({
	integrations: [solidJs()],
	output: 'server',
	adapter: aws(),
	vite: {
		plugins: [ecsstatic(), vanillaExtractPlugin()],
	},
});
