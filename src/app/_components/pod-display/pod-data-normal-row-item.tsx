"use client";

import { CopyIcon, DeleteIcon, DownloadIcon, FileIcon, FolderIcon, ShareIcon, ThreeDotsMenuIcon } from "~/app/_assets/svg";
import styles from "./pod-display-styles.module.css";
import Link from "next/link";
import { type DocumentInfo } from "~/types/SolidData";
import { useEffect, useRef, useState } from "react";
import { mergeClassnames } from "~/app/_utils";

interface PodDataNormalRowItemProps {
  docInfo: DocumentInfo;
  folderName: string;
  handleCopyLink: (resourceUrl: string | undefined) => void;
  handleDeleteResource: (resourceUrl: string | undefined) => void;
  handleDetailsClick: (resourceUrl: string | undefined) => void;
  handleDownloadResource: (resourceUrl: string | undefined, key: string) => Promise<void>;
  index: number;
}
export default function PodDataNormalRowItem({
  docInfo,
  folderName,
  handleCopyLink,
  handleDeleteResource,
  handleDetailsClick,
  handleDownloadResource,
  index,
}: Readonly<PodDataNormalRowItemProps>) {
  const [isShowingDropdown, setIsShowingDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFolder = folderName.endsWith("/");
  const resourceUrl = docInfo.url;

  const lastModifiedDate = docInfo.lastModified;
  const fileSize = docInfo.fileSize;
  const locationBarUrl = new URL(window.location.href);
  const resourceNextjsLink = `${locationBarUrl.href}/${folderName}`;

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
      <div className={styles.resourceNameContainer}>
        {isFolder ? (
          <Link
            className={styles.folderLinks}
            href={resourceNextjsLink}>
            {decodeURIComponent(folderName.slice(0, -1))}
          </Link>
        ) : (
          <p className={styles.resourceLinks}>{decodeURIComponent(folderName)}</p>
        )}
      </div>
      <div className={styles.lastModifiedContainer}>
        <p>{lastModifiedDate ?? ""}</p>
      </div>
      <div className={styles.fileSizeContainer}>
        <p>{fileSize ?? "--"}</p>
      </div>
      <div
        ref={dropdownRef}
        className={styles.actionsContainer}>
        <button onClick={handleClick}>
          <ThreeDotsMenuIcon />
        </button>
        <div
          data-testid={`cy-dropdown-menu-${index}`}
          className={mergeClassnames(styles.dropdownMenuContainer, isShowingDropdown ? "block" : "hidden")}>
          <div className={styles.dropdownMenuInner}>
            <button
              className={styles.menuItem}
              onClick={closeDropdownHOC(() => handleDetailsClick(resourceUrl))}
              type="button">
              <ShareIcon className={styles.menuItemIcon} />
              <p>View Details/Share</p>
            </button>
            {!isFolder ? (
              <button
                className={styles.menuItem}
                onClick={closeDropdownHOC(async () => await handleDownloadResource(resourceUrl, folderName))}
                type="button">
                <DownloadIcon className={styles.menuItemIcon} />
                <p>Download Resource</p>
              </button>
            ) : (
              ""
            )}
            <button
              className={styles.menuItem}
              onClick={closeDropdownHOC(() => handleCopyLink(resourceUrl))}
              type="button">
              <CopyIcon className={styles.menuItemIcon} />
              <p>Copy Link</p>
            </button>
            <button
              data-testid={`cy-delete-btn-${index}`}
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
