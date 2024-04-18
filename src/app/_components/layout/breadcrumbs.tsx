"use client";
import { usePathname } from "next/navigation";
import styles from "./layout-styles.module.css";
import Link from "next/link";

export default function Breadcrumbs() {
  /* breadcrumb uses app url to navigate between pages... 
  (i) http://localhost:3001/your-data/contacts/contactsInner1/ci5/ciii1/
  instead of using actual CSS url 
  (ii) http://localhost:3001/<rootPodUrl>/contacts/contactsInner1/ci5/ciii1/
  but when link to (i), the page function, NestedYourDataPages(), will convert (i) to (ii) before calling CSS to getSolidDataSet
  */
  const fullPathUrl = new URL(window.location.href);
  const segments = fullPathUrl.pathname.split("/").filter((item) => item ?? item);
  let pathSegment = "";
  const mapSegmentToUrlArray: string[] = [];
  segments.forEach((item, index) => {
    pathSegment += `${item}/`;
    mapSegmentToUrlArray[index] = `${fullPathUrl.origin}/${pathSegment}`;
  });

  return (
    <div className={styles.breadcrumbsContainer}>
      {segments.map((crumb, index) => {
        const crumbUrl = mapSegmentToUrlArray[index];
        let display = "";
        switch (crumb) {
          case "your-data":
            display = "My Data";
            break;
          case "contacts":
            display = "My Contacts";
            break;
          default:
            display = decodeURIComponent(crumb);
            break;
        }
        return (
          <Link
            key={index}
            className={styles.breadcrumbLink}
            href={crumbUrl ?? ""}>
            {display}
            {index === segments.length - 1 ? "" : <span className={styles.caret}>{">"}</span>}
          </Link>
        );
      })}
    </div>
  );
}

export function SharedBreadcrumbs() {
  const currentLocationPath = usePathname();
  const sharedPageBaseUrl = `${window.location.origin}/${currentLocationPath.split("/")[1]}/`;
  const segments = currentLocationPath.split("/").slice(2);

  let pathSegment = "";
  const mapSegmentToUrlArray: string[] = [];

  segments.forEach((item, index) => {
    pathSegment += `${item}/`;
    mapSegmentToUrlArray[index] = `${sharedPageBaseUrl}${pathSegment}`;
  });

  return (
    <div className={styles.breadcrumbsContainer}>
      {segments.map((crumb, index) => {
        const crumbUrl = mapSegmentToUrlArray[index];
        if (index === 0) {
          return (
            <Link
              key={index}
              className={styles.breadcrumbLink}
              href={"/shared-resources"}>
              {decodeURIComponent(crumb)}
              <span className={styles.caret}>{">"}</span>
            </Link>
          );
        } else {
          return (
            <Link
              key={index}
              className={styles.breadcrumbLink}
              href={crumbUrl ?? ""}>
              {decodeURIComponent(crumb)}
              {index === segments.length - 1 ? "" : <span className={styles.caret}>{">"}</span>}
            </Link>
          );
        }
      })}
    </div>
  );
}
