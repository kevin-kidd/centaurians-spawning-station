// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  SUPABASE_KEY_PRIVATE: z.string(),
  MNEMONIC: z.string(),
  BACKEND_ADDRESS: z.string(),
  LOGFLARE_API_KEY: z.string(),
  LOGFLARE_SOURCE_TOKEN: z.string(),
  TOURNAMENT_KEY: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_KEY: z.string(),
  NEXT_PUBLIC_NETWORK_TYPE: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  NEXT_PUBLIC_NETWORK_TYPE: process.env.NEXT_PUBLIC_NETWORK_TYPE,
};
