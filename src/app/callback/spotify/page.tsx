"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import moment from "moment";
import { writeDataIntoPod } from "~/app/_utils/spotify";
import { sleep, useGlobalContext } from "~/app/_context/store";
import globalStyles from "../../../styles/global-styles.module.css";
import { useRouter } from "next/navigation";
import styles from "./callback-spotify-styles.module.css";
import Link from "next/link";

export default function Spotify() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>("");
  const [podUrlLink] = useState<string>(localStorage.getItem("podUrlLink") ?? "");
  const [completedItemsSentences, setCompletedItemsSentences] = useState<string[]>([]);
  const importingItemsString = localStorage.getItem("import_items") ?? "";
  const [importingItems] = useState<string[]>(importingItemsString.split(","));
  const { webId, podUrl } = useGlobalContext();

  const code = localStorage.getItem("code");
  const verifier = localStorage.getItem("verifier");
  const getTokenInfo = api.spotify.getTokenInfo.useQuery(
    { code: code, verifier },
    {
      enabled: false,
      retry: 0,
    }
  );

  const connectToServices = api.userConnectedService.updateOrCreateMyConnectedService.useMutation();

  useEffect(() => {
    if (getTokenInfo.isFetched && getTokenInfo.isError) {
      localStorage.removeItem("import_items");
      localStorage.removeItem("can_fetch_spotify");
      return;
    }

    if (!getTokenInfo.isFetched || !getTokenInfo.data) return;

    localStorage.setItem("spotify_access_token", getTokenInfo.data.access_token);
    const expires_at = new Date().getTime() + getTokenInfo.data.expires_in * 1000; // in milliseconds from 1-1-1970
    localStorage.setItem("spotify_expires_at", expires_at.toString());
    localStorage.setItem("spotify_refresh_token", getTokenInfo.data.refresh_token);
    setAccessToken(getTokenInfo.data.access_token);
    if (webId && webId?.length > 0) {
      connectToServices.mutate({
        web_id: webId,
        service_name: "SPOTIFY",
        access_token: getTokenInfo.data.access_token,
        refresh_token: getTokenInfo.data.refresh_token,
        expires_at: expires_at.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTokenInfo.isFetched]);

  const getPlaylists = api.spotify.getPlaylists.useQuery(
    {
      access_token: accessToken ?? "",
      podUrl: podUrlLink ?? "",
    },
    { enabled: false }
  );

  const getProfile = api.spotify.getProfile.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getAlbums = api.spotify.getAlbums.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getAudiobooks = api.spotify.getAudiobooks.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getEpisodes = api.spotify.getEpisodes.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getShows = api.spotify.getShows.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getTracks = api.spotify.getTracks.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getTopArtists = api.spotify.getTopArtists.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getTopTracks = api.spotify.getTopTracks.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getFollowings = api.spotify.getFollowings.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  //playlists
  useEffect(() => {
    if (getPlaylists.isFetched && webId) {
      if (!getPlaylists.data) return;
      const playlistResponse = getPlaylists?.data;
      const playlists = playlistResponse?.items;
      void writeDataIntoPod(podUrlLink ?? "", "playlists", playlists ?? [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, `...Successfully Retrieved User's ${playlists.length} Playlists`]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPlaylists.isFetched]);

  //profile
  useEffect(() => {
    if (getProfile.isFetched && webId) {
      if (!getProfile.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "profile", getProfile.data ? [getProfile.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, `...Successfully Retrieved Current User's Profile`]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProfile.isFetched]);

  //albums
  useEffect(() => {
    if (getAlbums.isFetched && webId) {
      if (!getAlbums.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "albums", getAlbums?.data?.items ?? [], webId).then(() => {
        setCompletedItemsSentences([
          ...completedItemsSentences,
          `...Successfully Retrieved User's ${getAlbums?.data?.items?.length ?? 0} Saved Albums`,
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAlbums.isFetched]);

  //audiobook
  useEffect(() => {
    if (getAudiobooks.isFetched && webId) {
      if (!getAudiobooks.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "audiobooks", getAudiobooks?.data?.items ?? [], webId).then(() => {
        setCompletedItemsSentences([
          ...completedItemsSentences,
          `...Successfully Retrieved User's ${getAudiobooks?.data?.items?.length ?? 0} Saved Audiobooks`,
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAudiobooks.isFetched]);

  //shows
  useEffect(() => {
    if (getShows.isFetched && webId) {
      if (!getShows.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "shows", getShows?.data?.items ?? [], webId).then(() => {
        setCompletedItemsSentences([
          ...completedItemsSentences,
          `...Successfully Retrieved User's ${getShows?.data?.items?.length ?? 0} Saved Shows`,
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getShows.isFetched]);

  //episodes
  useEffect(() => {
    if (getEpisodes.isFetched && webId) {
      if (!getEpisodes.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "episodes", getEpisodes?.data?.items ?? [], webId).then(() => {
        setCompletedItemsSentences([
          ...completedItemsSentences,
          `...Successfully Retrieved User's ${getEpisodes?.data?.items?.length ?? 0} Saved Episodes`,
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEpisodes.isFetched]);

  //tracks
  useEffect(() => {
    if (getTracks.isFetched && webId) {
      if (!getTracks.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "tracks", getTracks?.data?.items ?? [], webId).then(() => {
        setCompletedItemsSentences([
          ...completedItemsSentences,
          `...Successfully Retrieved User's ${getTracks?.data?.items?.length ?? 0} Saved Tracks`,
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTracks.isFetched]);

  //top artists
  useEffect(() => {
    if (getTopArtists.isFetched && webId) {
      if (!getTopArtists.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "top artists", getTopArtists?.data?.items ?? [], webId).then(() => {
        setCompletedItemsSentences([
          ...completedItemsSentences,
          `...Successfully Retrieved User's ${getTopArtists?.data?.items?.length ?? 0} Top Artists(medium-term)`,
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTopArtists.isFetched]);

  //top tracks
  useEffect(() => {
    if (getTopTracks.isFetched && webId) {
      if (!getTopTracks.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "top tracks", getTopTracks?.data?.items ?? [], webId).then(() => {
        setCompletedItemsSentences([
          ...completedItemsSentences,
          `...Successfully Retrieved User's ${getTopTracks?.data?.items?.length ?? 0} Top Tracks(medium-term)`,
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTopTracks.isFetched]);

  //following
  useEffect(() => {
    if (getFollowings.isFetched && webId) {
      if (!getFollowings.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "followings", getFollowings?.data?.artists?.items ?? [], webId).then(() => {
        setCompletedItemsSentences([
          ...completedItemsSentences,
          `...Successfully Retrieved User's ${getFollowings?.data?.artists?.items?.length ?? 0} Followed Artists`,
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFollowings.isFetched]);

  useEffect(() => {
    const accessToken = localStorage.getItem("spotify_access_token") ?? "";
    const expiresAt = localStorage.getItem("spotify_expires_at") ?? "";
    if (accessToken.length === 0 || (expiresAt?.length > 0 && Number(expiresAt) <= moment().unix() * 1000)) {
      void getTokenInfo.refetch();
    } else {
      setAccessToken(localStorage.getItem("spotify_access_token") ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      if (importingItems.includes("Playlists")) {
        await sleep(1000);
        await getPlaylists.refetch();
        await sleep(2500);
      }
      if (importingItems.includes("Profile")) {
        await getProfile.refetch();
        await sleep(2500);
      }
      if (importingItems.includes("Albums")) {
        await getAlbums.refetch();
        await sleep(2500);
      }
      if (importingItems.includes("Audiobooks")) {
        await getAudiobooks.refetch();
        await sleep(2500);
      }
      if (importingItems.includes("Episodes")) {
        await getEpisodes.refetch();
        await sleep(2500);
      }
      if (importingItems.includes("Shows")) {
        await getShows.refetch();
        await sleep(2500);
      }
      if (importingItems.includes("Tracks")) {
        await getTracks.refetch();
        await sleep(2500);
      }
      if (importingItems.includes("Top Artists")) {
        await getTopArtists.refetch();
        await sleep(2500);
      }
      if (importingItems.includes("Top Tracks")) {
        await getTopTracks.refetch();
        await sleep(2500);
      }
      if (importingItems.includes("Following")) {
        await getFollowings.refetch();
        await sleep(2500);
      }
      localStorage.removeItem("import_items");
      localStorage.removeItem("can_fetch_spotify");
    };

    const canFetchSpotify = localStorage.getItem("can_fetch_spotify") ?? "";
    if (canFetchSpotify === "true" && accessToken.length > 0) {
      void fetchSpotifyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Error when logging in
  // const authError = params.get("error");
  // if (!isLoading) {
  //   return <div>Succesfully synchronised with spotify!</div>;
  // }

  // if (authError) {
  //   return (
  //     <div className="flex h-screen flex-col items-center justify-center gap-2">
  //       <p>Error when logging into Spotify: {authError}</p>
  //       <div className="flex gap-3">
  //         <Link
  //           href="/discover"
  //           className="rounded-lg bg-purple-dark p-2 text-white">
  //           Cancel
  //         </Link>
  //         <RetryButton />
  //       </div>
  //     </div>
  //   );
  // }

  // // No code is available
  // if (!code) {
  //   return (
  //     <div className="flex h-screen flex-col items-center justify-center gap-2">
  //       <p>Error: unable to retrieve code from Spotify</p>
  //       <div className="flex gap-3">
  //         <Link
  //           href="/discover"
  //           className="rounded-lg bg-purple-dark p-2 text-white">
  //           Cancel
  //         </Link>
  //         <RetryButton />
  //       </div>
  //     </div>
  //   );
  // }

  // if (getTokenInfo.isError) {
  //   return (
  //     <div className="flex h-screen flex-col items-center justify-center gap-2">
  //       <p>Error code: {getTokenInfo.error.data?.code}</p>
  //       <p className="max-w-xs whitespace-pre-wrap">Error message: {getTokenInfo.error.message}</p>
  //       <div className="flex gap-3">
  //         <Link
  //           href="/discover"
  //           className="rounded-lg bg-purple-dark p-2 text-white">
  //           Cancel
  //         </Link>
  //         <RetryButton />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className={styles.mainTitle}>Spotify data for Solid</div>
      <div className={styles.dividerWithTopBottomMargin}></div>
      <div className={styles.subTitle}>Import Spotify Data</div>
      <div>
        {completedItemsSentences.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>

      {getTokenInfo.isFetched && getTokenInfo.isError && (
        <div className={globalStyles.errorMsg}>
          <p className="mb-4">Import Data Error! </p>{" "}
          <Link href={"/discover"}>
            <button className={globalStyles.primaryButton}>Continue</button>
          </Link>
        </div>
      )}

      {completedItemsSentences.length === importingItems.length && (
        <>
          <div className={styles.dividerWithTopBottomMargin}></div>
          <div className="mb-6">
            Your Spotify data has been saved at{" "}
            <button
              className={styles.podUrl}
              onClick={() => {
                const path = podUrlLink.replace(`${podUrl}`, "");
                router.push(`/your-data/${path}`);
              }}
              type="button">
              {podUrlLink}
            </button>
          </div>
          <button
            data-testid="cy-spotify-cb-continue-btn"
            className={completedItemsSentences.length !== importingItems.length ? globalStyles.primaryButtonInactive : globalStyles.primaryButton}
            disabled={completedItemsSentences.length !== importingItems.length}
            onClick={() => {
              router.push("/your-data");
            }}>
            Continue
          </button>
        </>
      )}
    </>
    // <div className="flex h-screen flex-col items-center justify-center gap-2">
    //   <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-t-purple-dark" />
    //   <p>Synchronising with spotify...</p>
    // </div>
  );
}
