import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    BASE_URL: z.string(),
    CSS_BASE_URL: z.string(),
    CSS_BASE_URL_2: z.string(),
    DB_HOST: z.string(),
    DB_CLIENT: z.string(),
    DB_NAME: z.string(),
    DB_PORT: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    SPOTIFY_API_BASE_URL: z.string(),
    SPOTIFY_AUTH_URL: z.string(),
    SPOTIFY_CLIENT_ID: z.string(),
    SPOTIFY_CLIENT_SECRET: z.string(),
    SPOTIFY_TOKEN_URL: z.string(),
    YOUTUBE_AUTH_URL: z.string(),
    YOUTUBE_API_BASE_URL: z.string(),
    YOUTUBE_API_KEY: z.string(),
    YOUTUBE_CLIENT_ID: z.string(),
    YOUTUBE_CLIENT_SECRET: z.string(),
    YOUTUBE_TOKEN_URL: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_CSS_BASE_URL: z.string(),
    NEXT_PUBLIC_CSS_BASE_URL_2: z.string(),
    NEXT_PUBLIC_SPOTIFY_AUTH_URL: z.string(),
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z.string(),
    NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET: z.string(),
    NEXT_PUBLIC_CSS_REGISTER_URL: z.string(),
    NEXT_PUBLIC_SPOTIFY_TOKEN_URL: z.string(),
    NEXT_PUBLIC_YOUTUBE_AUTH_URL: z.string(),
    NEXT_PUBLIC_YOUTUBE_API_BASE_URL: z.string(),
    NEXT_PUBLIC_YOUTUBE_API_KEY: z.string(),
    NEXT_PUBLIC_YOUTUBE_CLIENT_ID: z.string(),
    NEXT_PUBLIC_YOUTUBE_CLIENT_SECRET: z.string(),
    NEXT_PUBLIC_YOUTUBE_TOKEN_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.BASE_URL,
    CSS_BASE_URL: process.env.CSS_BASE_URL,
    CSS_BASE_URL_2: process.env.CSS_BASE_URL_2,
    SPOTIFY_API_BASE_URL: process.env.SPOTIFY_API_BASE_URL,
    SPOTIFY_AUTH_URL: process.env.SPOTIFY_AUTH_URL,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_TOKEN_URL: process.env.SPOTIFY_TOKEN_URL,
    YOUTUBE_AUTH_URL: process.env.YOUTUBE_AUTH_URL,
    YOUTUBE_API_BASE_URL: process.env.YOUTUBE_API_BASE_URL,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
    YOUTUBE_TOKEN_URL: process.env.YOUTUBE_TOKEN_URL,

    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CSS_BASE_URL: process.env.NEXT_PUBLIC_CSS_BASE_URL,
    NEXT_PUBLIC_CSS_BASE_URL_2: process.env.NEXT_PUBLIC_CSS_BASE_URL_2,
    DB_CLIENT: process.env.DB_CLIENT,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    NEXT_PUBLIC_CSS_REGISTER_URL: process.env.NEXT_PUBLIC_CSS_REGISTER_URL,
    NEXT_PUBLIC_SPOTIFY_AUTH_URL: process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL,
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
    NEXT_PUBLIC_SPOTIFY_TOKEN_URL: process.env.NEXT_PUBLIC_SPOTIFY_TOKEN_URL,
    NEXT_PUBLIC_YOUTUBE_AUTH_URL: process.env.NEXT_PUBLIC_YOUTUBE_AUTH_URL,
    NEXT_PUBLIC_YOUTUBE_API_BASE_URL: process.env.NEXT_PUBLIC_YOUTUBE_API_BASE_URL,
    NEXT_PUBLIC_YOUTUBE_API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    NEXT_PUBLIC_YOUTUBE_CLIENT_ID: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
    NEXT_PUBLIC_YOUTUBE_CLIENT_SECRET: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_SECRET,
    NEXT_PUBLIC_YOUTUBE_TOKEN_URL: process.env.NEXT_PUBLIC_YOUTUBE_TOKEN_URL,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
