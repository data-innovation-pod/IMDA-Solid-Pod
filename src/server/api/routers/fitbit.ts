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
        client_id: z.string().nullable(),
        client_secret: z.string().nullable(),
        code: z.string().nullable(),
        code_verifier: z.string().nullable(),
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
      const base64 = btoa(`${input.client_id}:${input.client_secret}`);
      if (!input.code && !input.code_verifier) {
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
      if (!input.code_verifier) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Verifier is null or undefined",
        });
      }

      const result = await fetch(env.FITBIT_TOKEN_URL, {
        method: "POST",
        headers: {
          Authorization: `Basic ${base64}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: input.code,
          client_id: env.FITBIT_CLIENT_ID,
          // client_secret: env.FITBIT_CLIENT_SECRET, don't need for PKCE, which is recommended for public clients like web apps
          grant_type: "authorization_code",
          redirect_uri: env.NEXT_PUBLIC_BASE_URL,
          code_verifier: input.code_verifier,
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
      const result = await fetch(`${env.FITBIT_API_BASE_URL}.2/user/-/sleep/date/${currentDate}.json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      const data = (await result.json()) as Sleep;
      return data;
    }),
  // TODO: uncomment when able to get friends
  // getFriends: publicProcedure
  //   .input(
  //     z.object({
  //       access_token: z.string().min(1),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/friends.json`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${input.access_token}`,
  //       },
  //     });
  //     const data = (await result.json()) as Friends;
  //     return data;
  //   }),
  getFoodLog: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/foods/log/date/${currentDate}.json`, {
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
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/foods/log/water/date/${currentDate}.json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });
      const data = (await result.json()) as Water;
      return data;
    }),
  // TODO: uncomment when able to detect core temperature with device
  // getTemperatureCore: publicProcedure
  //   .input(
  //     z.object({
  //       access_token: z.string().nullable(),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const currentDate = format(new Date(), "yyyy-MM-dd");
  //     const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/temp/core/date/${currentDate}.json`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${input.access_token}`,
  //       },
  //     });

  //     if (!result.ok) {
  //       throw new Error(`Error fetching core temperature: ${result.statusText}`);
  //     }

  //     // const data = (await result.json()) as Temperature;
  //     const data = JSON.parse(await result.text()) as Temperature;
  //     return data;
  //   }),
  // TODO: uncomment when able to getDevices used
  // getDevices: publicProcedure
  //   .input(
  //     z.object({
  //       access_token: z.string().nullable(),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/devices.json`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${input.access_token}`,
  //         accept: "application/json",
  //       },
  //     });

  //     if (!result.ok) {
  //       throw new Error(`Error fetching devices: ${result.statusText}`);
  //     }
  //     console.log("access token: ", input.access_token);
  //     const devices = (await result.json()) as Devices;
  //     const data = {};
  //     for (const device of devices) {
  //       data[device.deviceVersion] = {
  //         deviceVersion: device.deviceVersion,
  //         ...device,
  //       };
  //     }
  //     console.log("data dewvices: ", data);
  //     return data;
  //   }),
  // TODO: uncomment when able to get heart rate
  // getHeartRate: publicProcedure
  //   .input(
  //     z.object({
  //       access_token: z.string().nullable(),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/activities/heart/date/today/1d.json`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${input.access_token}`,
  //       },
  //     });

  //     if (!result.ok) {
  //       throw new Error(`Error fetching heart rate: ${result.statusText}`);
  //     }

  //     // const data = (await result.json()) as HeartRate;
  //     const data = JSON.parse(await result.text()) as HeartRate;
  //     console.log("after json: ", data);
  //     return data;
  //   }),
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

      if (!result.ok) {
        throw new Error(`Error fetching profile: ${result.statusText}`);
      }

      const data = JSON.parse(await result.text()) as Profile;
      return data;
    }),
  // TODO: uncomment when able to get breathing rate
  // getBreathingRate: publicProcedure
  //   .input(
  //     z.object({
  //       access_token: z.string().nullable(),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/activities/breathing/date/today.json`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${input.access_token}`,
  //       },
  //     });

  //     if (!result.ok) {
  //       throw new Error(`Error fetching breathing rate: ${result.statusText}`);
  //     }
  //     // const data = (await result.json()) as Breathing;
  //     const data = JSON.parse(await result.text()) as Breathing;
  //     console.log("after json: ", data);
  //     return data;
  //   }),

  // TODO: uncomment when able to get daily activity
  // getDailyActivity: publicProcedure
  //   .input(
  //     z.object({
  //       access_token: z.string().nullable(),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const currentDate = format(new Date(), "yyyy-MM-dd");
  //     const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/activities/date/${currentDate}.json`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${input.access_token}`,
  //       },
  //     });

  //     if (!result.ok) {
  //       throw new Error(`Error fetching daily activity: ${result.statusText}`);
  //     }
  //     // const data = (await result.json()) as Activity;
  //     const data = JSON.parse(await result.text()) as Activity;
  //     return data;
  //   }),
  // TODO: uncomment when able to get oxygen saturation
  // getOxygenSaturation: publicProcedure
  //   .input(
  //     z.object({
  //       access_token: z.string().nullable(),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/spo2/date/today.json`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${input.access_token}`,
  //       },
  //     });

  //     if (!result.ok) {
  //       throw new Error(`Error fetching oxygen saturation: ${result.statusText}`);
  //     }
  //     // const data = (await result.json()) as OxygenSaturation;
  //     const data = JSON.parse(await result.text()) as OxygenSaturation;
  //     console.log("after json: ", data);
  //     return data;
  //   }),
  getWeightLog: publicProcedure
    .input(
      z.object({
        access_token: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const result = await fetch(`${env.FITBIT_API_BASE_URL}/user/-/body/log/weight/date/${currentDate}.json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      if (!result.ok) {
        throw new Error(`Error fetching weight log: ${result.statusText}`);
      }

      const data = (await result.json()) as Weight;
      return data;
    }),
});
