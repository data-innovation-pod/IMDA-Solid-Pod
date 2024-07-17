import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { type SpotifyTokenInfo } from "~/types/TokenInfo";

import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { fetch } from "@inrupt/solid-client-authn-browser";
import type { Album, Artist, Audiobook, Episode, FollowingResponse, ListResponse, Playlist, Profile, Show, Track } from "~/types/Spotify";

type SpotifyError = {
  error: string;
  error_description: string;
};

export const spotifyRouter = createTRPCRouter({
  getTokenInfo: publicProcedure
    .input(
      z.object({
        code: z.string().nullable(),
        verifier: z.string().nullable(),
      })
    )
    .output(
      z.object({
        access_token: z.string(),
        expires_in: z.number(),
        refresh_token: z.string(),
        scope: z.string(),
        token_type: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.code && input.verifier) {
        console.log("code and verifier exists");
      }

      if (!input.code && !input.verifier) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Code and verifier are null or undefined",
        });
      }
      if (!input.code) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Code is null or undefined",
        });
      }
      if (!input.verifier) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Verifier is null or undefined",
        });
      }

      const result = await fetch(env.SPOTIFY_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: input.code,
          client_id: env.SPOTIFY_CLIENT_ID,
          client_secret: env.SPOTIFY_CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: env.NEXT_PUBLIC_BASE_URL,
          code_verifier: input.verifier,
        }),
      });
      console.log({ result });
      const data = (await result.json()) as SpotifyTokenInfo & SpotifyError;
      if (data.access_token && data.refresh_token) {
        console.log("obtained access token and refresh token");
      }

      if (data.error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.error_description,
        });
      }

      return data as SpotifyTokenInfo;
    }),
  getPlaylists: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
        podUrl: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      console.log("querying playlists");
      if (!input.access_token) {
        console.log("no access token");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "access_token cannot be null or undefined",
        });
      }

      if (!input.podUrl) {
        console.log("no podurl");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "podUrl cannot be null or undefined",
        });
      }

      const result = await fetch(`${env.SPOTIFY_API_BASE_URL}/me/playlists`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      console.log("before data, result is: ", result);
      const data = (await result.json()) as ListResponse<Playlist>;
      console.log("result/data is: ", data);
      return data;
    }),
  getProfile: publicProcedure
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.SPOTIFY_API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Profile;

      return data;
    }),
  getAlbums: publicProcedure
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.SPOTIFY_API_BASE_URL}/me/albums`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      const data = (await result.json()) as ListResponse<Album>;

      return data;
    }),
  getAudiobooks: publicProcedure
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.SPOTIFY_API_BASE_URL}/me/audiobooks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      const data = (await result.json()) as ListResponse<Audiobook>;

      return data;
    }),
  getShows: publicProcedure
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.SPOTIFY_API_BASE_URL}/me/shows`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      const data = (await result.json()) as ListResponse<Show>;

      return data;
    }),
  getEpisodes: publicProcedure
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.SPOTIFY_API_BASE_URL}/me/episodes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      const data = (await result.json()) as ListResponse<Episode>;

      return data;
    }),
  getTracks: publicProcedure
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.SPOTIFY_API_BASE_URL}/me/tracks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      const data = (await result.json()) as ListResponse<Track>;

      return data;
    }),
  getTopArtists: publicProcedure
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.SPOTIFY_API_BASE_URL}/me/top/artists?time_range=long_term`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      const data = (await result.json()) as ListResponse<Artist>;

      return data;
    }),
  getTopTracks: publicProcedure
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.SPOTIFY_API_BASE_URL}/me/top/tracks?time_range=long_term`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      const data = (await result.json()) as ListResponse<Track>;

      return data;
    }),

  getFollowings: publicProcedure
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.SPOTIFY_API_BASE_URL}/me/following?type=artist`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      const data = (await result.json()) as FollowingResponse;

      return data;
    }),
});
