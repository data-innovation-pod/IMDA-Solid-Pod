"use client";

import { useEffect, useRef, useState } from "react";
import FitbitSelectionModal, { type FitbitSelectionModalHandle } from "./fitbit-modal";

import styles from "./fitbit-styles.module.css";

export function FitbitConnectButton() {
  const [fitbitAccessToken, setFitbitAccessToken] = useState<string | null>(null);
  const FitbitSelectionModalRef = useRef<FitbitSelectionModalHandle>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("fitbit_access_token");
    setFitbitAccessToken(accessToken);
  }, []);

  function handleClick() {
    FitbitSelectionModalRef.current?.show();
  }

  return (
    <>
      <button
        data-testid="cy-fitbit-connect-btn"
        onClick={handleClick}
        className={styles.connectButton}>
        <p className={styles.connectText}>Connect</p>
        <div className={styles.radioButton}>{fitbitAccessToken && <div className={styles.radioButtonContent} />}</div>
      </button>
      <FitbitSelectionModal ref={FitbitSelectionModalRef} />
    </>
  );
}
