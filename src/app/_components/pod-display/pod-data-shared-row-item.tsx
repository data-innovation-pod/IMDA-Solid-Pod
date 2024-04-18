"use client";

import styles from "./pod-display-styles.module.css";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FolderIcon, FileIcon, ThreeDotsMenuIcon, DownloadIcon, CopyIcon, DeleteIcon } from "~/app/_assets/svg";
import { mergeClassnames } from "~/app/_utils";
import { type DocumentInfo } from "~/types/SolidData";

interface PodDataSharedRowItemProps {
  currentLocation: string;
  docInfo: DocumentInfo;
  handleCopyLink: (resourceUrl: string | undefined) => void;
  handleDeleteResource: (resourceUrl: string | undefined) => void;
  handleDownloadResource: (resourceUrl: string | undefined, key: string, sharerWebId: string | undefined) => Promise<void>;
  sharerWebId: string;
  webId: string;
}
export default function PodDataSharedRowItem({
  currentLocation,
  docInfo,
  handleCopyLink,
  handleDeleteResource,
  handleDownloadResource,
  sharerWebId,
  webId,
}: Readonly<PodDataSharedRowItemProps>) {
  const [isShowingDropdown, setIsShowingDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFolder = webId.endsWith("/");
  const resourceUrl = docInfo.url;
  const rawlastSegmentPath = resourceUrl?.match(/([^/]+\/?)$/)?.[0];
  const cleanedLastSegmentPath = decodeURIComponent(rawlastSegmentPath ?? "");

  function handleClick() {
    setIsShowingDropdown((prev) => !prev);
  }

  function closeDropdownHOC(callback: () => void | Promise<void>) {
    return () => {
      void callback();
      setIsShowingDropdown(false);
    };
  }

  useEffect(() => {
    function handler(event: MouseEvent) {
      if (dropdownRef.current?.contains(event.target as Node)) return;
      setIsShowingDropdown(false);
    }
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div className={styles.resourceContainer}>
      <div className={styles.typeIconContainer}>
        {isFolder ? <FolderIcon className={styles.smallWidthIcon} /> : <FileIcon className={styles.smallIcon} />}
      </div>
      <div className={styles.sharedResourceNameContainer}>
        {isFolder ? (
          <Link
            className={styles.folderLinks}
            href={`${currentLocation}/${cleanedLastSegmentPath}`}>
            {decodeURIComponent(webId.slice(0, -1))}
          </Link>
        ) : (
          <p className={styles.resourceLinks}>{decodeURIComponent(webId)}</p>
        )}
      </div>

      <div
        ref={dropdownRef}
        className={styles.actionsContainer}>
        <button onClick={handleClick}>
          <ThreeDotsMenuIcon />
        </button>
        <div className={mergeClassnames(styles.dropdownMenuContainer, isShowingDropdown ? "block" : "hidden")}>
          <div className={styles.dropdownMenuInner}>
            {!isFolder ? (
              <button
                className={styles.menuItem}
                onClick={closeDropdownHOC(async () => await handleDownloadResource(resourceUrl, webId, sharerWebId))}
                type="button">
                <DownloadIcon className={styles.menuItemIcon} />
                <p>Download Resource</p>
              </button>
            ) : null}
            <button
              className={styles.menuItem}
              onClick={closeDropdownHOC(() => handleCopyLink(resourceUrl))}
              type="button">
              <CopyIcon className={styles.menuItemIcon} />
              <p>Copy Link</p>
            </button>
            <button
              className={styles.menuItemWithBorder}
              onClick={closeDropdownHOC(() => handleDeleteResource(resourceUrl))}
              type="button">
              <DeleteIcon className={styles.menuItemIcon} />
              <p>Delete</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
