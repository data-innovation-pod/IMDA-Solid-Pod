"use client";

import { useRef } from "react";
import YouTubeSelectionModal, { type YouTubeSelectionModalHandle } from "./youtube-modal";

import styles from "./youtube-styles.module.css";

export function YouTubeConnectButton() {
  const youtube_access_token = localStorage.getItem("youtube_access_token");

  const YouTubeSelectionModalRef = useRef<YouTubeSelectionModalHandle>(null);

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
        <div className={styles.radioButton}>{youtube_access_token && <div className={styles.radioButtonContent} />}</div>
      </button>
      <YouTubeSelectionModal ref={YouTubeSelectionModalRef} />
    </>
  );
}
