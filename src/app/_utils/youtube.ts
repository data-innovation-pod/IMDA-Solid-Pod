import { fetch } from "@inrupt/solid-client-authn-browser";
import { getSolidDataset, overwriteFile } from "@inrupt/solid-client";
import { type LikedVideo } from "~/types/Youtube";
import { createFolder } from "./wrangle-pods";
import { api } from "~/trpc/client";

function getKey(type: "liked videos", item: LikedVideo) {
  switch (type) {
    case "liked videos":
      const likedVideo = item;
      return likedVideo.snippet.title;
    default:
      return "";
  }
}

export async function writeDataIntoPod(location: string, type: "liked videos", items: LikedVideo[], webId: string) {
  try {
    const folderName = `${location}${type}/`;
    const auditTrailsForFolder = await api.audit.getMyAuditTrails.query({
      sort: [{ column: "created_at", order: "desc", nulls: "last" }],
      filter: { resource_url: folderName },
      loginWebId: webId,
    });

    if (items.length > 0) {
      if (auditTrailsForFolder.length === 0 || auditTrailsForFolder[0]?.action_type === "DELETE CONTAINER") {
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
        const overwriteLocation = `${location}${encodeURIComponent(type)}/${encodeURIComponent(writingKey)}`;
        try {
          await overwriteFile(overwriteLocation, dataFile, { contentType: "application/json", fetch });

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
