"use client";
import { type DocumentInfo } from "~/types/SolidData";
import styles from "./pod-display-styles.module.css";

import { PersonIcon, ThreeDotsMenuIcon, ViewProfileIcon, DeleteIcon } from "~/app/_assets/svg";
import { useEffect, useRef, useState } from "react";
import { mergeClassnames } from "~/app/_utils";
import { getProfileImage } from "~/app/_utils/wrangle-pods";
import Image from "next/image";

interface PodDataContactsRowItemProps {
  docInfo: DocumentInfo;
  handleDeleteResource: (resourceUrl: string | undefined) => void;
  handleViewProfile: (webIdUrl: string | undefined) => Promise<void>;
  index: number;
}
export default function PodDataContactsRowItem({ docInfo, handleDeleteResource, handleViewProfile, index }: Readonly<PodDataContactsRowItemProps>) {
  const [isShowingDropdown, setIsShowingDropdown] = useState<boolean>(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const resourceUrl = docInfo?.url;
  const wedIdUrl = docInfo?.webIdUrl;
  const profileName = docInfo?.name;

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

  useEffect(() => {
    void (async () => {
      const profileImage = await getProfileImage(decodeURIComponent(wedIdUrl ?? ""));
      const profileImageUrl = profileImage ? profileImage?.internal_resourceInfo.sourceIri : "";
      setProfileImageUrl(profileImageUrl);
    })();
  }, [wedIdUrl]);

  return (
    <div className={styles.resourceContainer}>
      <div className={styles.typeIconContainer}>
        {profileImageUrl ? (
          <Image
            className={styles.profileImage}
            src={profileImageUrl}
            alt="profile"
            width={30}
            height={30}
          />
        ) : (
          <PersonIcon className={styles.smallWidthIcon} />
        )}
      </div>
      <div className={styles.contactNameContainer}>
        <p>{decodeURIComponent(profileName ?? "")}</p>
      </div>
      <div className={styles.contactWebIdContainer}>
        <p>{wedIdUrl}</p>
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
              data-testid={`cy-profile-btn-${index}`}
              className={styles.menuItem}
              onClick={closeDropdownHOC(async () => await handleViewProfile(wedIdUrl))}
              type="button">
              <ViewProfileIcon className={styles.menuItemIcon} />
              <p>View Profile</p>
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
