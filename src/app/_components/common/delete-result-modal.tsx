"use client";

import { mergeClassnames } from "~/app/_utils";
import styles from "./common-styles.module.css";
import globalStyles from "~/styles/global-styles.module.css";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export interface DeleteResultModalHandle {
  show: () => void;
  updateIsSuccessful: (isSuccessful: boolean | "profile") => void;
}

const DeleteResultModal = forwardRef<DeleteResultModalHandle>(function DeleteResultModal(_, ref) {
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean | "profile">(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      show: () => setIsShowing(true),
      updateIsSuccessful: (isSuccessful) => setIsSuccessful(isSuccessful),
    }),
    []
  );

  function handleClose() {
    setIsShowing(false);
    window.location.reload();
  }

  function handleOutsideClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (boxRef.current?.contains(event.target as Node)) return;
    handleClose();
  }

  return (
    <div
      className={mergeClassnames(styles.modalBackground, isShowing ? "flex" : "hidden")}
      onClick={handleOutsideClick}>
      <div
        className={styles.modalBox}
        ref={boxRef}>
        <p className="mb-4">{getText(isSuccessful)}</p>
        <button
          className={globalStyles.primaryButton}
          onClick={handleClose}>
          OK
        </button>
      </div>
    </div>
  );
});

function getText(isSuccessful: boolean | "profile") {
  if (isSuccessful === "profile") {
    return "Not allowed to delete profile";
  }
  if (isSuccessful) {
    return "Successfully deleted";
  }
  return "Delete was unsuccessful";
}

export default DeleteResultModal;
