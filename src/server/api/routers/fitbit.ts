import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { type FitbitTokenInfo } from "~/types/TokenInfo";

import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { fetch } from "@inrupt/solid-client-authn-browser";
import type {
  Activity,
  Breathing,
  Devices,
  Food,
  Friends,
  HeartRate,
  OxygenSaturation,
  Profile,
  Sleep,
  Temperature,
  Water,
  Weight,
} from "~/types/Fitbit";
import { format } from "date-fns";

type FitbitError = {
  error: string;
  error_description: string;
};

export const fitbitRouter = createTRPCRouter({
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

      const result = await fetch(env.FITBIT_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: input.code,
          client_id: env.FITBIT_CLIENT_ID,
          client_secret: env.FITBIT_CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: env.NEXT_PUBLIC_BASE_URL,
          code_verifier: input.verifier,
        }),
      });
      const data = (await result.json()) as FitbitTokenInfo & FitbitError;

      if (data.error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.error_description,
        });
      }

      return data as FitbitTokenInfo;
    }),
  getSleepLog: publicProcedure
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/sleep/date/${currentDate}.json}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Sleep;
      return data;
    }),
  getFriends: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/friends.json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Friends;
      return data;
    }),
  getFoodLog: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/foods/log/date/${currentDate}.json}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Food;
      return data;
    }),
  getWaterLog: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/foods/log/water/date/${currentDate}.json}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Water;
      return data;
    }),

  getTemperatureCore: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/temp/core/date/${currentDate}.json}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Temperature;
      return data;
    }),
  getDevices: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/devices.json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Devices;
      return data;
    }),
  getHeartRate: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/activities/heart/date/today/1d.json}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as HeartRate;
      return data;
    }),
  getProfile: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/profile.json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Profile;
      return data;
    }),
  getBreathingRate: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/activities/breathing/date/today.json}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Breathing;
      return data;
    }),
  getDailyActivity: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/activities/date/${currentDate}.json}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Activity;
      return data;
    }),
  getOxygenSaturation: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/spo2/date/today.json}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as OxygenSaturation;
      return data;
    }),
  getWeightLog: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/body/log/weight/date/${currentDate}.json}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Weight;
      return data;
    }),
});
