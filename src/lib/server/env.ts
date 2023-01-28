import { z } from "zod";

const envSchema = z.object({
	DISCORD_CLIENT_ID: z.string(),
	DISCORD_CLIENT_SECRET: z.string(),
	AUTH_SECRET: z.string(),
	AUTH_TRUST_HOST: z.boolean(),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(import.meta.env);
