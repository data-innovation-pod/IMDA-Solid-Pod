"use client";

import { useEffect, useRef, useState } from "react";
import YouTubeSelectionModal, { type YouTubeSelectionModalHandle } from "./youtube-modal";

import styles from "./youtube-styles.module.css";

export function YouTubeConnectButton() {
  const [youtubeAccessToken, setYouTubeAccessToken] = useState<string | null>(null);
  const YouTubeSelectionModalRef = useRef<YouTubeSelectionModalHandle>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("youtube_access_token");
    setYouTubeAccessToken(accessToken);
  }, []);

  function handleClick() {
    YouTubeSelectionModalRef.current?.show();
  }

  return (
    <>
      <button
        data-testid="cy-youtube-connect-btn"
        onClick={handleClick}
        className={styles.connectButton}>
        <p className={styles.connectText}>Connect</p>
        <div className={styles.radioButton}>{youtubeAccessToken && <div className={styles.radioButtonContent} />}</div>
      </button>
      <YouTubeSelectionModal ref={YouTubeSelectionModalRef} />
    </>
  );
}
