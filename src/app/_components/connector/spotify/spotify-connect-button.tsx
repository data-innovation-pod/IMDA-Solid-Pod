"use client";

import { useRef } from "react";
import SpotifySelectionModal, { type SpotifySelectionModalHandle } from "./spotify-modal";

import styles from "./spotify-styles.module.css";

export function SpotifyConnectButton() {
  const spotify_access_token = localStorage.getItem("spotify_access_token");

  const SpotifySelectionModalRef = useRef<SpotifySelectionModalHandle>(null);

  function handleClick() {
    SpotifySelectionModalRef.current?.show();
  }

  return (
    <>
      <button
        data-testid="cy-spotify-connect-btn"
        onClick={handleClick}
        className={styles.connectButton}>
        <p className={styles.connectText}>Connect</p>
        <div className={styles.radioButton}>{spotify_access_token && <div className={styles.radioButtonContent} />}</div>
      </button>
      <SpotifySelectionModal ref={SpotifySelectionModalRef} />
    </>
  );
}
