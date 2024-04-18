"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FolderIcon } from "~/app/_assets/svg";
import { getYouTubeQueryParams } from "./get-youtube-query-params";
import { useRouter } from "next/navigation";
import { env } from "~/env.mjs";
import SelectFolderModal, { type SelectFolderModalHandle } from "../select-folder/select-folder-modal";
import DisplayBreadcrumb from "../select-folder/display-breadcrumb";
import { useGlobalContext } from "~/app/_context/store";
import { mergeClassnames } from "~/app/_utils";

import styles from "./youtube-styles.module.css";
import moment from "moment";

export interface YouTubeSelectionModalHandle {
  show: () => void;
  hide: () => void;
}

const YouTubeSelectionModal = forwardRef<YouTubeSelectionModalHandle>(function YouTubeSelectionModal(props, ref) {
  const { podUrl } = useGlobalContext();
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [confirmedPath, setConfirmedPath] = useState<string[] | undefined>();
  const router = useRouter();
  const selectFolderModalRef = useRef<SelectFolderModalHandle>(null);

  const isImportButtonEnabled = confirmedPath !== undefined && confirmedPath !== null;

  useImperativeHandle(ref, () => {
    return {
      show() {
        setIsShowing(true);
      },
      hide() {
        setIsShowing(false);
      },
    };
  });

  const handleImportClick = () => {
    localStorage.setItem("can_fetch_youtube", "true");
    // localStorage.removeItem("code"); //to remove the code saved for CSS when logged in
    const accessToken = localStorage.getItem("youtube_access_token");
    const expiresAt = localStorage.getItem("youtube_expires_at");
    localStorage.setItem("podUrlLink", `${podUrl}${confirmedPath?.join("")}`);
    if (accessToken && accessToken.length > 0 && expiresAt && expiresAt.length > 0 && Number(expiresAt) > moment().unix() * 1000) {
      window.location.href = env.NEXT_PUBLIC_BASE_URL;
    } else {
      const queryParamsString = getYouTubeQueryParams();
      router.push(`${env.NEXT_PUBLIC_YOUTUBE_AUTH_URL}?${queryParamsString}`);
    }
  };

  // mergeClassnames;

  return (
    <>
      <div
        data-testid="cy-youtube-modal"
        className={mergeClassnames(styles.modalBackground, isShowing ? "flex" : "hidden")}>
        <div className={styles.modalContainer}>
          <p className={styles.modalTitle}>Import from YouTube</p>
          <p className="mb-4">{"We'll retrieve the following data: Liked videos"}</p>
          <form>
            {!confirmedPath ? (
              <button
                data-testid="cy-show-select-folder-modal-btn"
                type="button"
                onClick={() => selectFolderModalRef.current?.show()}
                className={styles.folderButtonContainer}>
                <div className={styles.folderIconWrapper}>
                  <FolderIcon />
                </div>
                <div>Select folder...</div>
              </button>
            ) : (
              <button
                data-testid="cy-change-folder-btn"
                onClick={() => selectFolderModalRef.current?.show()}
                type="button">
                <DisplayBreadcrumb
                  baseLabel="Your data"
                  paths={confirmedPath}
                />
              </button>
            )}
            <div className={styles.importAndCancelButtonContainer}>
              <button
                data-testid="cy-import-youtube-btn"
                disabled={!isImportButtonEnabled}
                onClick={() => {
                  if (isImportButtonEnabled) {
                    handleImportClick();
                    setIsShowing(false);
                  }
                }}
                type="button"
                className={isImportButtonEnabled ? styles.enabledImportButton : styles.disabledImportButton}>
                Import
              </button>
              <button
                data-testid="cy-cancel-btn"
                onClick={() => setIsShowing(false)}
                type="button"
                className={styles.modalCancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <SelectFolderModal
        ref={selectFolderModalRef}
        setConfirmedPath={setConfirmedPath}
      />
    </>
  );
});

export default YouTubeSelectionModal;
