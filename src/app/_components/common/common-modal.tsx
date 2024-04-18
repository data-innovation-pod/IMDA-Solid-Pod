"use client";

import { mergeClassnames } from "~/app/_utils";
import styles from "./common-styles.module.css";
import globalStyles from "~/styles/global-styles.module.css";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export interface CommonModalHandle {
  show: () => void;
}

interface CommonModalProps {
  text: string;
  onClose?: () => void;
  classNames?: string;
}

const CommonModal = forwardRef<CommonModalHandle, CommonModalProps>(function CommonModal({ text, onClose, classNames }, ref) {
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      show: () => setIsShowing(true),
    }),
    []
  );

  function handleClose() {
    if (onClose) onClose();
    setIsShowing(false);
  }

  function handleOutsideClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (boxRef.current?.contains(event.target as Node)) return;
    setIsShowing(false);
  }

  return (
    <div
      className={mergeClassnames(styles.modalBackground, isShowing ? "flex" : "hidden")}
      onClick={handleOutsideClick}>
      <div
        className={styles.modalBox}
        ref={boxRef}>
        <p className={`mb-4 ${classNames}`}>{text}</p>
        <button
          className={globalStyles.primaryButton}
          onClick={handleClose}>
          Okay
        </button>
      </div>
    </div>
  );
});

export default CommonModal;
