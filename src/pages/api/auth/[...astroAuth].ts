import { AstroAuth, type AstroAuthConfig } from "auth-astro";
import Discord from "@auth/core/providers/discord";
import { env } from "@/server/env";

export const authOpts: AstroAuthConfig = {
    providers: [
        // @ts-ignore
        Discord({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        }),
    ],
} as const;

export const { get, post } = AstroAuth(authOpts);
