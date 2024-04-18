import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { type YouTubeTokenInfo } from "~/types/TokenInfo";

import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { fetch } from "@inrupt/solid-client-authn-browser";
import type { LikedVideo, ListResponse } from "~/types/Youtube";

type YouTubeError = {
  error: string;
  error_description: string;
};

export const youtubeRouter = createTRPCRouter({
  getTokenInfo: publicProcedure
    .input(
      z.object({
        code: z.string().nullable(),
      })
    )
    .output(
      z.object({
        access_token: z.string(),
        expires_in: z.number(),
        scope: z.string(),
        token_type: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input.code) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Code is null or undefined",
        });
      }
      console.log("youtube api running");
      const result = await fetch(env.YOUTUBE_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: input.code,
          client_id: env.YOUTUBE_CLIENT_ID,
          client_secret: env.YOUTUBE_CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: env.NEXT_PUBLIC_BASE_URL,
        }),
      });

      const data = (await result.json()) as YouTubeTokenInfo & YouTubeError;

      if (data.error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.error_description,
        });
      }

      return data as YouTubeTokenInfo;
    }),
  getLikedVideos: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
        podUrl: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      if (!input.access_token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "access_token cannot be null or undefined",
        });
      }

      if (!input.podUrl) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "podUrl cannot be null or undefined",
        });
      }

      const result = await fetch(
        `${env.YOUTUBE_API_BASE_URL}/videos?part=snippet%2CcontentDetails%2Cstatistics&myRating=like&key=${env.YOUTUBE_API_KEY}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${input.access_token}`,
            Accept: `application/json`,
          },
        }
      );
      const data = (await result.json()) as ListResponse<LikedVideo>;

      return data;
    }),
});
