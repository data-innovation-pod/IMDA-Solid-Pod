"use client";

import { type Dispatch, type SetStateAction, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { CrossIcon } from "~/app/_assets/svg";
import SelectFolderBreadcrumb from "./select-folder-breadcrumb";
import { useGlobalContext } from "~/app/_context/store";
import { type DocumentObject } from "~/types/SolidData";
import { getPodDataForDisplay, mergeClassnames } from "~/app/_utils";

import styles from "./select-folder-styles.module.css";
import Checkmark from "~/app/_assets/svg/checkmark";

interface SelectFolderModalProps {
  setConfirmedPath: Dispatch<SetStateAction<string[] | undefined>>;
}

export interface SelectFolderModalHandle {
  show: () => void;
  hide: () => void;
}

const SelectFolderModal = forwardRef<SelectFolderModalHandle, SelectFolderModalProps>(function SelectFolderModal(props, ref) {
  const { setConfirmedPath } = props;
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [paths, setPaths] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string[] | undefined>();

  const [structure, setStructure] = useState<DocumentObject>(undefined);
  const { podUrl } = useGlobalContext();
  const solidDataUrl = paths.length === 0 ? podUrl : [podUrl, "/", ...paths].join("");

  useEffect(() => {
    if (solidDataUrl) {
      getPodDataForDisplay(solidDataUrl)
        .then((result) => {
          setStructure(result);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [podUrl, solidDataUrl]);

  useImperativeHandle(
    ref,
    () => {
      return {
        show() {
          setIsShowing(true);
        },
        hide() {
          setIsShowing(false);
        },
      };
    },
    []
  );

  function createHandleClick(key: string) {
    return () => {
      setPaths((prev) => [...prev, key]);
    };
  }

  function handleConfirmFolder() {
    setConfirmedPath(selectedPath);
    setIsShowing(false);
  }

  return (
    <div
      data-testid="cy-select-folder-modal"
      className={mergeClassnames(`${styles.modalBackground}`, isShowing ? "flex" : "hidden")}>
      <div className={styles.modalContainer}>
        <div className={styles.modalTitleContainer}>
          <p className={styles.modalTitle}>Select Folder</p>
          <button onClick={() => setIsShowing(false)}>
            <CrossIcon />
          </button>
        </div>
        <SelectFolderBreadcrumb
          baseLabel="Your Data"
          paths={paths}
          setPaths={setPaths}
        />

        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <div className={styles.titleColumn}>
                <div className="w-9" />
                <span>Name</span>
              </div>
              <span className={styles.lastModifiedColumn}>Last Modified</span>
            </tr>
          </thead>
          <tbody>
            {structure &&
              Object.keys(structure)
                .filter((key) => key.endsWith("/"))
                .map((key) => {
                  const documentInfo = structure[key]!;
                  const { lastModified } = documentInfo;
                  const isSelected = selectedPath?.join("/") === [...paths, key].join("/");

                  return (
                    <tr
                      key={key}
                      className={styles.tableDataItem}>
                      <div className={styles.titleColumn}>
                        <div
                          onClick={() => setSelectedPath([...paths, key])}
                          className={styles.radioButtonWrapper}>
                          <button
                            data-testid={`cy-select-${key}-folder-btn`}
                            className={mergeClassnames(styles.radioButton, isSelected ? "bg-purple-dark" : "")}>
                            {isSelected && <Checkmark />}
                          </button>
                        </div>
                        <button
                          data-testid={`cy-${key}-folder`}
                          onClick={createHandleClick(key)}
                          className="truncate">
                          {key}
                        </button>
                      </div>
                      <span className={styles.lastModifiedColumn}>{lastModified}</span>
                    </tr>
                  );
                })}
          </tbody>
        </table>
        <div className="flex justify-end">
          <button
            data-testid="cy-confirm-folder-btn"
            disabled={!selectedPath}
            onClick={handleConfirmFolder}
            className={!selectedPath ? styles.disabledSelectFolderButton : styles.enabledSelectFolderButton}>
            Select Folder
          </button>
        </div>
      </div>
    </div>
  );
});

export default SelectFolderModal;
