import { AstroAuth, type AstroAuthConfig } from "auth-astro";
import Discord from "@auth/core/providers/discord";

const authOpts: AstroAuthConfig = {
	providers: [
		// @ts-ignore
		Discord({
			clientId: import.meta.env.DISCORD_CLIENT_ID,
			clientSecret: import.meta.env.DISCORD_CLIENT_SECRET,
		}),
	],
};

export const { get, post } = AstroAuth(authOpts);
