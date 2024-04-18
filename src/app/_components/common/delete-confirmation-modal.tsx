"use client";

import { mergeClassnames } from "~/app/_utils";
import styles from "./common-styles.module.css";
import globalStyles from "~/styles/global-styles.module.css";

import { type RefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getSolidDataset } from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { deleteResource, recursiveDeleteResource } from "~/app/_utils/wrangle-pods";
import { useGlobalContext } from "~/app/_context/store";
import { type DeleteResultModalHandle } from "./delete-result-modal";

export interface DeleteConfirmationModalHandle {
  updateUrlToDelete: (newUrlToDelete: string | undefined) => void;
  updateSharerWebId: (newSharerWebId: string | undefined) => void;
}

interface DeleteConfirmationModalProps {
  deleteResultModalRef: RefObject<DeleteResultModalHandle>;
}

const DeleteConfirmationModal = forwardRef<DeleteConfirmationModalHandle, DeleteConfirmationModalProps>(function DeleteConfirmationModal(
  { deleteResultModalRef },
  ref
) {
  const { webId } = useGlobalContext();
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [urlToDelete, setUrlToDelete] = useState<string | undefined>(undefined);
  const [sharerWebId, setSharerWebId] = useState<string | undefined>(undefined);
  const boxRef = useRef<HTMLDivElement>(null);

  const isEnabled = urlToDelete && webId;

  useImperativeHandle(
    ref,
    () => {
      return {
        updateUrlToDelete: (newUrlToDelete) => {
          setUrlToDelete(newUrlToDelete);
        },
        updateSharerWebId: (newSharerWebId) => {
          setSharerWebId(newSharerWebId);
        },
      };
    },
    []
  );

  function handleClose() {
    setUrlToDelete(undefined);
    setSharerWebId(undefined);
    setIsShowing(false);
    setIsDeleting(false);
  }

  function handleOutsideClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (boxRef.current?.contains(event.target as Node)) return;
    handleClose();
  }

  async function handleConfirm() {
    if (!isEnabled) return;
    setIsDeleting(true);
    const result = await recursiveDeleteResource(urlToDelete, webId ?? "", sharerWebId);
    setIsDeleting(false);
    deleteResultModalRef?.current?.updateIsSuccessful(result === "deleted");
    deleteResultModalRef?.current?.show();
    handleClose();
  }

  useEffect(() => {
    void (async () => {
      if (!isEnabled) return;

      const isFolder = urlToDelete.endsWith("/");
      if (!isFolder) {
        setIsDeleting(true);
        const result = await deleteResource(urlToDelete, webId, sharerWebId);
        setIsDeleting(false);
        deleteResultModalRef?.current?.updateIsSuccessful(result === "deleted");
        deleteResultModalRef?.current?.show();
        return;
      }

      const isProfile = urlToDelete.split("/").at(-2) === "profile";
      if (isProfile) {
        deleteResultModalRef?.current?.updateIsSuccessful("profile");
        deleteResultModalRef?.current?.show();
        return;
      }

      const podData = await getSolidDataset(urlToDelete, { fetch });
      const podDataContents = podData.graphs.default; // the very first item in podData.graphs.default will be the current container
      const childUrls = Object.keys(podDataContents).slice(1);
      if (childUrls.length !== 0) {
        setIsShowing(true);
        return;
      }

      setIsDeleting(true);
      const result = await deleteResource(urlToDelete, webId, sharerWebId);
      setIsDeleting(false);
      deleteResultModalRef?.current?.updateIsSuccessful(result === "deleted");
      deleteResultModalRef?.current?.show();
    })();
  }, [urlToDelete, sharerWebId, isEnabled, webId, deleteResultModalRef]);

  return (
    <div
      className={mergeClassnames(styles.modalBackground, isShowing ? "flex" : "hidden")}
      onClick={handleOutsideClick}>
      <div
        className={styles.modalBox}
        ref={boxRef}>
        {isEnabled ? (
          <>
            <p className="mb-4">
              The folder you are about to delete contains some files. Click confirm to delete the entire folder and the files within.
            </p>
            <div className={styles.buttonContainer}>
              <button
                className={globalStyles.primaryButton}
                disabled={isDeleting}
                onClick={handleConfirm}
                type="button">
                {isDeleting ? (
                  <div className="flex gap-2">
                    <span>Deleting</span>
                    <div className={styles.loader} />
                  </div>
                ) : (
                  <span>Confirm</span>
                )}
              </button>
              <button
                className={globalStyles.secondaryButton}
                onClick={handleClose}
                type="button">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4">{"The folder's url or webId is not valid"}</p>
            <button
              className={globalStyles.primaryButton}
              onClick={handleClose}
              type="button">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
});

export default DeleteConfirmationModal;
