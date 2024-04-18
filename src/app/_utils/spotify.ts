import { fetch } from "@inrupt/solid-client-authn-browser";
import { getSolidDataset, overwriteFile } from "@inrupt/solid-client";
import type { Album, AlbumTrack, Artist, Audiobook, Episode, Following, Playlist, Profile, Show, Track } from "~/types/Spotify";
import { createFolder } from "./wrangle-pods";
import { api } from "~/trpc/client";

function getKey(
  type: "profile" | "albums" | "audiobooks" | "episodes" | "followings" | "playlists" | "shows" | "tracks" | "top artists" | "top tracks",
  item: Album | Artist | Audiobook | Episode | Following | Playlist | Profile | Show | Track
) {
  switch (type) {
    case "profile":
      const profile = item as Profile;
      return profile.display_name;
    case "albums":
      const album = item as Album;
      return album.album.name;
    case "audiobooks":
      const audiobook = item as Audiobook;
      return audiobook.name;
    case "episodes":
      const episode = item as Episode;
      return episode.episode.name;
    case "followings":
      const following = item as Following;
      return following.name;
    case "playlists":
      const playlist = item as Playlist;
      return playlist.name;
    case "shows":
      const show = item as Show;
      return show.show.name;
    case "tracks":
      const track = item as Track;
      return track.track.name;
    case "top tracks":
      const topTrack = item as AlbumTrack;
      return topTrack.name;
    case "top artists":
      const topArtist = item as Artist;
      return topArtist.name;
    default:
      return "";
  }
}

export async function writeDataIntoPod(
  location: string,
  type: "profile" | "albums" | "audiobooks" | "episodes" | "followings" | "playlists" | "shows" | "tracks" | "top artists" | "top tracks",
  items: Album[] | Artist[] | Audiobook[] | Episode[] | Following[] | Playlist[] | Profile[] | Show[] | Track[],
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
