import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";

import { env } from "~/env.mjs";

export const transformer = superjson;

export function getUrl() {
  // Server side
  if (typeof window === "undefined") {
    return env.BASE_URL + "/api/trpc";
  }

  // Client side
  return env.NEXT_PUBLIC_BASE_URL + "/api/trpc";
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
