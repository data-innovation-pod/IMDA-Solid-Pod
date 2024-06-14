"use client";

import { useEffect, useRef, useState } from "react";
import SpotifySelectionModal, { type SpotifySelectionModalHandle } from "./spotify-modal";

import styles from "./spotify-styles.module.css";

export function SpotifyConnectButton() {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);
  const SpotifySelectionModalRef = useRef<SpotifySelectionModalHandle>(null);

  useEffect(() => {
    const spotifyAccessTokenFromStorage = localStorage.getItem("spotify_access_token");
    setSpotifyAccessToken(spotifyAccessTokenFromStorage);
  }, []);

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
        <div className={styles.radioButton}>{spotifyAccessToken && <div className={styles.radioButtonContent} />}</div>
      </button>
      <SpotifySelectionModal ref={SpotifySelectionModalRef} />
    </>
  );
}
