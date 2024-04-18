"use client";

import { PurpleFolderIcon } from "~/app/_assets/svg";
import Chevron from "~/app/_assets/svg/chevron";

import styles from "./select-folder-styles.module.css";

interface DisplayBreadcrumbProps {
  baseLabel: string;
  paths: string[];
}

export default function DisplayBreadcrumb({ baseLabel, paths }: DisplayBreadcrumbProps) {
  return (
    <div className={styles.displayBreadcrumbContainer}>
      <PurpleFolderIcon />
      <div>{baseLabel}</div>
      {paths.map((path) => {
        return (
          <>
            <Chevron direction="right" />
            <div>{path}</div>
          </>
        );
      })}
    </div>
  );
}
