"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import moment from "moment";
import { writeDataIntoPod } from "~/app/_utils/youtube";
import { sleep, useGlobalContext } from "~/app/_context/store";
import globalStyles from "../../../styles/global-styles.module.css";
import { useRouter } from "next/navigation";
import styles from "./callback-youtube-styles.module.css";
import Link from "next/link";

export default function Youtube() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>("");
  const [podUrlLink] = useState<string>(localStorage.getItem("podUrlLink") ?? "");
  const [completedItemsSentences, setCompletedItemsSentences] = useState<string[]>([]);
  const importingItemsString = localStorage.getItem("import_items") ?? "";
  const [importingItems] = useState<string[]>(importingItemsString.split(","));
  const { webId, podUrl } = useGlobalContext();

  const code = localStorage.getItem("code");

  const getTokenInfo = api.youtube.getTokenInfo.useQuery(
    { code: code },
    {
      enabled: false,
      retry: 0,
    }
  );

  const connectToServices = api.userConnectedService.updateOrCreateMyConnectedService.useMutation();

  useEffect(() => {
    if (getTokenInfo.isFetched && getTokenInfo.isError) {
      localStorage.removeItem("import_items");
      localStorage.removeItem("can_fetch_youtube");
      return;
    }

    if (!getTokenInfo.isFetched || !getTokenInfo.data) return;

    localStorage.setItem("youtube_access_token", getTokenInfo.data.access_token);
    const expires_at = new Date().getTime() + getTokenInfo.data.expires_in * 1000; // in milliseconds from 1-1-1970
    localStorage.setItem("youtube_expires_at", expires_at.toString());
    localStorage.setItem("youtube_refresh_token", "");
    setAccessToken(getTokenInfo.data.access_token);
    if (webId && webId?.length > 0) {
      connectToServices.mutate({
        web_id: webId,
        service_name: "YOUTUBE",
        access_token: getTokenInfo.data.access_token,
        refresh_token: "",
        expires_at: expires_at.toString(),
      });
    }
  }, [getTokenInfo.isFetched]);

  useEffect(() => {
    const accessToken = localStorage.getItem("youtube_access_token") ?? "";
    const expiresAt = localStorage.getItem("youtube_expires_at") ?? "";
    if (accessToken.length === 0 || (expiresAt?.length > 0 && Number(expiresAt) <= moment().unix() * 1000)) {
      void getTokenInfo.refetch();
    } else {
      setAccessToken(localStorage.getItem("youtube_access_token") ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLikedVideos = api.youtube.getLikedVideos.useQuery(
    {
      access_token: accessToken ?? "",
      podUrl: podUrlLink ?? "",
    },
    { enabled: false }
  );

  useEffect(() => {
    if (getLikedVideos.isFetched && webId) {
      if (!getLikedVideos.data) return;
      const likedVideosResponse = getLikedVideos?.data;
      const likedVideos = likedVideosResponse?.items;
      void writeDataIntoPod(podUrlLink ?? "", "liked videos", likedVideos ?? [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, `...Got User's ${likedVideos.length} Liked Videos`]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLikedVideos.isFetched]);

  useEffect(() => {
    const fetchYouTubeData = async () => {
      await sleep(1000);
      await getLikedVideos.refetch();
      await sleep(2500);
      localStorage.removeItem("import_items");
      localStorage.removeItem("can_fetch_youtube");
    };

    const canFetchYouTube = localStorage.getItem("can_fetch_youtube") ?? "";
    if (canFetchYouTube === "true" && accessToken.length > 0) {
      void fetchYouTubeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <>
      <div className={styles.mainTitle}>Ingest YouTube data for Solid</div>
      <div className={styles.dividerWithTopBottomMargin}></div>
      <div className={styles.subTitle}>Import YouTube Data</div>
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
            Your YouTube data has been saved at{" "}
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
            data-testid="cy-youtube-cb-continue-btn"
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
  );
}
