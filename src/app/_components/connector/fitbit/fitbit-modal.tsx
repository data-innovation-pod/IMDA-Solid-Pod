"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FolderIcon } from "~/app/_assets/svg";
import { getFitbitQueryParams } from "./get-fitbit-query-params";
import { useRouter } from "next/navigation";
import { env } from "~/env.mjs";
import SelectFolderModal, { type SelectFolderModalHandle } from "../select-folder/select-folder-modal";
import DisplayBreadcrumb from "../select-folder/display-breadcrumb";
import { useGlobalContext } from "~/app/_context/store";
import { mergeClassnames } from "~/app/_utils";

import styles from "./fitbit-styles.module.css";
import moment from "moment";

export interface FitbitSelectionModalHandle {
  show: () => void;
  hide: () => void;
}

interface InputProps {
  label: string;
  value: string;
  onChange: () => void;
}

function Input({ label, value, onChange }: InputProps) {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev); // toggle the state of the checkbox
  };

  return (
    <div className={styles.formItem}>
      <input
        checked={isChecked}
        id={value}
        name={value}
        onChange={() => {
          handleCheckboxChange();
          onChange?.();
        }}
        type="checkbox"
        value={value}
        className={styles.inputContainer}
      />
      <label htmlFor={value}>{label}</label>
    </div>
  );
}
const availableImports = [
  "Sleep",
  // "Friends",
  "Food",
  "Water",
  // "Temperature",
  // "Devices",
  // "Heart Rate",
  "Profile",
  // "Breathing Rate",
  // "Activities",
  // "Oxygen Saturation",
  "Weight",
];
const FitbitSelectionModal = forwardRef<FitbitSelectionModalHandle>(function FitbitSelectionModal(props, ref) {
  const { podUrl } = useGlobalContext();
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [imports, setImports] = useState<string[]>(availableImports);
  const [confirmedPath, setConfirmedPath] = useState<string[] | undefined>();
  const router = useRouter();
  const selectFolderModalRef = useRef<SelectFolderModalHandle>(null);

  const isImportButtonEnabled = imports.length !== 0 && confirmedPath !== undefined && confirmedPath !== null;

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

  const handleImportClick = async () => {
    localStorage.setItem("can_fetch_fitbit", "true");
    const accessToken = localStorage.getItem("fitbit_access_token");
    const expiresAt = localStorage.getItem("fitbit_expires_at");
    localStorage.setItem("podUrlLink", `${podUrl}${confirmedPath?.join("")}`);
    localStorage.setItem("import_items", imports.join(","));
    if (accessToken && accessToken.length > 0 && expiresAt && expiresAt.length > 0 && Number(expiresAt) > moment().unix() * 1000) {
      window.location.href = env.NEXT_PUBLIC_BASE_URL;
    } else {
      const queryParamsString = await getFitbitQueryParams();
      router.push(`${env.NEXT_PUBLIC_FITBIT_AUTH_URL}?${queryParamsString}`);
    }
  };

  const handleCheckboxesChange = (value: string) => () => {
    let updatedImports = [...imports];
    if (imports.includes(value)) {
      updatedImports = updatedImports.filter((item) => item !== value);
    } else {
      updatedImports.push(value);
    }
    setImports(updatedImports);
  };

  // mergeClassnames;

  return (
    <>
      <div
        data-testid="cy-fitbit-modal"
        className={mergeClassnames(styles.modalBackground, isShowing ? "flex" : "hidden")}>
        <div className={styles.modalContainer}>
          <p className={styles.modalTitle}>Import from Fitbit</p>
          <p className="mb-4">{"We'll retrieve the following data:"}</p>
          <form>
            <div className={styles.importForm}>
              {availableImports.map((item) => (
                <Input
                  key={item}
                  label={item}
                  value={item}
                  onChange={handleCheckboxesChange(item)}
                />
              ))}
            </div>
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
                data-testid="cy-import-fitbit-btn"
                disabled={!isImportButtonEnabled}
                onClick={() => {
                  if (isImportButtonEnabled) {
                    void handleImportClick();
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

export default FitbitSelectionModal;
