"use client";

import { type Dispatch, type SetStateAction } from "react";
import Chevron from "~/app/_assets/svg/chevron";

import styles from "./select-folder-styles.module.css";

interface SelectFolderBreadcrumbProps {
  baseLabel: string;
  paths: string[];
  setPaths: Dispatch<SetStateAction<string[]>>;
}

export default function SelectFolderBreadcrumb({ baseLabel, paths, setPaths }: SelectFolderBreadcrumbProps) {
  return (
    <div className={styles.breadcrumbContainer}>
      <button onClick={() => setPaths([])}>{baseLabel}</button>
      {paths.map((path, pathIndex) => {
        const currentPaths = paths.slice(0, pathIndex + 1);

        function handleClick() {
          setPaths(currentPaths);
        }

        return (
          <>
            <Chevron direction="right" />
            <button onClick={handleClick}>{path}</button>
          </>
        );
      })}
    </div>
  );
}
