"use client";

import { usePathname } from "next/navigation";
import { AuditTrailIcon, SideBarContactsIcon, DataIcon, DiscoverIcon, PodLogo } from "../../_assets/svg";
import Link from "next/link";
import styles from "./layout-styles.module.css";
import SharedResourcesIcon from "~/app/_assets/svg/shared-resources-icon";
import { type SidebarProps } from "~/types/JsxComponents";

const navContents = [
  { icon: <DataIcon />, title: "My Data", url: "/your-data" },
  { icon: <SideBarContactsIcon />, title: "My Contacts", url: "/contacts" },
  { icon: <SharedResourcesIcon />, title: "Shared Data", url: "/shared-resources", otherUrls: ["/sharedby"] },
  { icon: <DiscoverIcon />, title: "Applications", url: "/discover" },
  { icon: <AuditTrailIcon />, title: "History", url: "/audit-trail" },
];

export default function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <nav className={styles.sidebarNav}>
        <div className={styles.podLogo}>
          <PodLogo className={styles.logo} />
        </div>
        <ul className={styles.linksMenu}>
          {variant !== "empty" &&
            navContents.map(({ icon, title, url, otherUrls }, index) => {
              let isActive = pathname.startsWith(url);
              if (otherUrls) {
                for (const otherUrl of otherUrls) {
                  if (pathname.startsWith(otherUrl)) {
                    isActive = true;
                    break;
                  }
                }
              }

              return (
                <li key={index}>
                  <Link
                    data-testid={`cy-${url}-link`}
                    href={url}
                    className={isActive ? styles.activeLink : styles.link}>
                    <div className="w-6">{icon}</div>
                    <span>{title}</span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>
      {/* Paddder to shift the main section */}
      <div className={styles.sidebarNavPadder} />
    </>
  );
}
