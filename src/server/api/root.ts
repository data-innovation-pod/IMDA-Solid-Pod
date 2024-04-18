import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { auditRouter } from "./routers/audit";
import { userConnectedServiceRouter } from "./routers/user_connected_services";
import { spotifyRouter } from "./routers/spotify";
import { youtubeRouter } from "./routers/youtube";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  audit: auditRouter,
  userConnectedService: userConnectedServiceRouter,
  spotify: spotifyRouter,
  youtube: youtubeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
