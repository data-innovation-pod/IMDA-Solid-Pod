import { fetch } from "@inrupt/solid-client-authn-browser";
import { getSolidDataset, overwriteFile } from "@inrupt/solid-client";
import { createFolder } from "./wrangle-pods";
import { api } from "~/trpc/client";
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

function getKey(
  type:
    | "sleep"
    | "friends"
    | "food"
    | "water"
    | "temperature"
    | "devices"
    | "heartRate"
    | "profile"
    | "breathingRate"
    | "dailyActivity"
    | "oxygenSaturation"
    | "weight",
  item: Sleep | Friends | Food | Water | Temperature | Devices | HeartRate | Profile | Breathing | Activity | OxygenSaturation | Weight
) {
  switch (type) {
    case "sleep":
      const sleep = item as Sleep;
      return sleep.sleep[0]?.dateOfSleep;
    case "friends":
      const friend = item as Friends;
      return friend.data[0]?.attributes?.name;
    case "food":
      const food = item as Food;
      return food.foods[0]?.loggedFood[0]?.name;
    case "water":
      const water = item as Water;
      return water.summary.water;
    case "temperature":
      const temperature = item as Temperature;
      return temperature.tempCore[0]?.dateTime;
    case "devices":
      const device = item as Devices;
      return device.devices[0]?.battery;
    case "heartRate":
      const heartRate = item as HeartRate;
      return heartRate.activitiesHeart[0]?.dateTime;
    case "profile":
      const profile = item as Profile;
      return profile.user.displayName;
    case "breathingRate":
      const breathing = item as Breathing;
      return breathing.br[0]?.dateTime;
    case "dailyActivity":
      const activity = item as Activity;
      return activity.goals;
    case "oxygenSaturation":
      const oxygen = item as OxygenSaturation;
      return oxygen.dateTime;
    case "weight":
      const weight = item as Weight;
      return weight.weight[0]?.date;
    default:
      return "";
  }
}

export async function writeDataIntoPod(
  location: string,
  type:
    | "sleep"
    | "friends"
    | "food"
    | "water"
    | "temperature"
    | "devices"
    | "heartRate"
    | "profile"
    | "breathingRate"
    | "dailyActivity"
    | "oxygenSaturation"
    | "weight",
  items:
    | Sleep[]
    | Friends[]
    | Food[]
    | Water[]
    | Temperature[]
    | Devices[]
    | HeartRate[]
    | Profile[]
    | Breathing[]
    | Activity[]
    | OxygenSaturation[]
    | Weight[],
  webId: string
) {
  try {
    const folderName = `${location}${type}/`;
    const auditTrailsForFolder = await api.audit.getMyAuditTrails.query({
      sort: [{ column: "created_at", order: "desc", nulls: "last" }],
      filter: { resource_url: folderName },
      loginWebId: webId,
    });

    if (items.length > 0) {
      if (auditTrailsForFolder.length === 0 || auditTrailsForFolder[0]?.action_type === "DELETE FOLDER") {
        await api.audit.createAuditTrail.mutate({
          loginWebId: webId,
          auditValue: {
            action_type: "CREATE FOLDER",
            actionee: webId,
            resource_url: decodeURIComponent(folderName),
          },
        });
      }

      for (const item of items) {
        const blob = new Blob([JSON.stringify(item)], { type: "application/json" });
        const writingKey = getKey(type, item);
        const dataFile: File = new File([blob], writingKey, { type: "application/json" });
        try {
          await overwriteFile(`${location}${type}/${writingKey}`, dataFile, { contentType: "application/json", fetch });

          await api.audit.createAuditTrail.mutate({
            loginWebId: webId,
            auditValue: {
              action_type: "UPLOAD RESOURCE",
              actionee: webId,
              resource_url: decodeURIComponent(`${location}${type}/${writingKey}`),
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      try {
        await getSolidDataset(`${location}${type}/`, { fetch });
      } catch (error) {
        const errorResult = error?.toString() ?? "";

        if (errorResult.includes("404") && (auditTrailsForFolder.length === 0 || auditTrailsForFolder[0]?.action_type === "DELETE FOLDER")) {
          await createFolder(`${location}`, type, webId);
        }
      }
    }
  } catch (error) {
    return;
  }
}
