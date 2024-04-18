"use client";

import styles from "./layout-styles.module.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronIcon, HeaderProfileIcon, ProfileCardIcon } from "~/app/_assets/svg";
import { useGlobalContext } from "~/app/_context/store";
import Link from "next/link";
import { logOut, mergeClassnames } from "~/app/_utils";
import { type HeaderProps } from "~/types/JsxComponents";

export default function Header({ variant }: HeaderProps) {
  const { webId, userDetails } = useGlobalContext();
  const [isShowingDropdown, setIsShowingDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  function handleClick() {
    setIsShowingDropdown((prev) => !prev);
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
    <nav className={styles.headerNav}>
      <p>IMDA Solid PODS (POC)</p>
      {variant !== "empty" && (
        <ul className={styles.linksMenu}>
          <li>
            <Link
              href="/help"
              className={styles.link}>
              ?
            </Link>
          </li>
          <li
            ref={dropdownRef}
            className={`${styles.link} ${styles.profileLink}`}>
            <button onClick={handleClick}>
              {userDetails?.imageUrl ? (
                <Image
                  className={styles.icon}
                  src={userDetails?.imageUrl}
                  alt="Profile"
                  width={128}
                  height={128}
                />
              ) : (
                <HeaderProfileIcon className={styles.icon} />
              )}
            </button>
            <div className={mergeClassnames(styles.profileDropdown, isShowingDropdown ? "block" : "hidden")}>
              <div className={styles.profileDropdownInner}>
                <div className={styles.profileContainer}>
                  {userDetails?.imageUrl ? (
                    <Image
                      className={styles.icon}
                      src={userDetails?.imageUrl}
                      alt="Profile"
                      width={128}
                      height={128}
                    />
                  ) : (
                    <HeaderProfileIcon
                      fillColor="#616161"
                      className={styles.icon}
                    />
                  )}
                  <div className={styles.profileText}>
                    <p className={styles.titleText}>{userDetails?.name}</p>
                    <p className={styles.titleText}>{userDetails?.email}</p>
                    <p className={styles.text}>{webId}</p>
                  </div>
                </div>
                <div>
                  <Link
                    data-testid="cy-edit-profile-button"
                    href="/profile"
                    className={styles.menuItem}>
                    <ProfileCardIcon className={styles.smallIcon} />
                    Edit profile
                  </Link>
                  <button
                    className={styles.menuItemWithBorder}
                    onClick={() => logOut()}
                    type="button">
                    <p>Sign out</p>
                    <ChevronIcon className={styles.midIcon} />
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      )}
    </nav>
  );
}
