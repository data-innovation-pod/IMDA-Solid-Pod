"use client";

import styles from "./pod-display-styles.module.css";
import { ResourceTypeIcon } from "../../_assets/svg";
import type {
  DisplayPodHeaderProps,
  DisplayPodNormalHeaderProps,
  DisplayPodContactsHeaderProps,
  DisplayPodSharedHeaderProps,
} from "~/types/JsxComponents";
import SortArrowIcon from "~/app/_assets/svg/sort-arrow-icon";

export default function PodDataHeader(props: DisplayPodHeaderProps) {
  if (!props.structure) return;

  return (
    <div className={styles.resourceContainer}>
      {props.variant === "pod" && (
        <NormalPodDataHeader
          createUpdateSort={props.createUpdateSort}
          currentSort={props.currentSort}
          variant={props.variant}
        />
      )}
      {props.variant === "shared" && (
        <SharedPodDataHeader
          variant={props.variant}
          createUpdateSort={props.createUpdateSort}
          currentSort={props.currentSort}
        />
      )}
      {props.variant === "contacts" && (
        <ContactsPodDataHeader
          createUpdateSort={props.createUpdateSort}
          currentSort={props.currentSort}
          variant={props.variant}
        />
      )}
    </div>
  );
}

function NormalPodDataHeader({ createUpdateSort, currentSort }: DisplayPodNormalHeaderProps) {
  const { colName, order } = currentSort;

  return (
    <>
      <div className={styles.typeIconContainer}>
        <ResourceTypeIcon className={styles.smallIcon} />
      </div>
      <div className={styles.resourceNameContainer}>
        <button
          className={styles.colHeader}
          onClick={createUpdateSort("name")}
          type="button">
          Name
          {colName === "name" && <SortArrowIcon sort={order} />}
        </button>
      </div>
      <div className={styles.lastModifiedContainer}>
        <button
          className={styles.colHeader}
          onClick={createUpdateSort("lastModified")}
          type="button">
          Last Modified {colName === "lastModified" && <SortArrowIcon sort={order} />}
        </button>
      </div>
      <div className={styles.fileSizeContainer}>
        <button
          className={styles.colHeader}
          onClick={createUpdateSort("fileSize")}
          type="button">
          File Size {colName === "fileSize" && <SortArrowIcon sort={order} />}
        </button>
      </div>
      <div className={styles.disabledActionsContainer}></div>
    </>
  );
}

function SharedPodDataHeader({ createUpdateSort, currentSort }: DisplayPodSharedHeaderProps) {
  const { colName, order } = currentSort;

  return (
    <>
      <div className={styles.typeIconContainer}>
        <ResourceTypeIcon className={styles.smallIcon} />
      </div>
      <div className={styles.sharedResourceNameContainer}>
        <button
          className={styles.colHeader}
          onClick={createUpdateSort("name")}
          type="button">
          Name
          {colName === "name" && <SortArrowIcon sort={order} />}
        </button>
      </div>
      <div className={styles.disabledActionsContainer}></div>
    </>
  );
}

function ContactsPodDataHeader({ createUpdateSort, currentSort }: DisplayPodContactsHeaderProps) {
  const { colName, order } = currentSort;

  return (
    <>
      <div className={styles.typeIconContainer}></div>
      <div className={styles.contactNameContainer}>
        <button
          className={styles.colHeader}
          onClick={createUpdateSort("name")}
          type="button">
          Name {colName === "name" && <SortArrowIcon sort={order} />}
        </button>
      </div>
      <div className={styles.contactWebIdContainer}>
        <button
          className={styles.colHeader}
          onClick={createUpdateSort("webIdUrl")}
          type="button">
          WebID {colName === "webIdUrl" && <SortArrowIcon sort={order} />}
        </button>
      </div>
      <div className={styles.disabledActionsContainer}></div>
    </>
  );
}
