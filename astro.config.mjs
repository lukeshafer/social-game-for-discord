import { defineConfig } from "astro/config";
import { ecsstatic } from "@acab/ecsstatic/vite";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	integrations: [solidJs()],
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	vite: {
		plugins: [ecsstatic()],
	},
});
