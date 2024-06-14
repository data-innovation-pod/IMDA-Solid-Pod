/**
 * File for next configuration such as webpack config, env variables, image optimisation, etc
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ["localhost", "server1.sgpod.co", "server2.sgpod.co"],
  },
};

export default config;
