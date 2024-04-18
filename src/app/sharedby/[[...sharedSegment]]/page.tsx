"use client";

import CommandBar from "~/app/_components/layout/command-bar";
import { SharedBreadcrumbs } from "~/app/_components/layout/breadcrumbs";
import DisplayPodContents from "~/app/_components/pod-display/display-pod-contents";
import globalStyles from "../../../styles/global-styles.module.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { type DocumentObject } from "~/types/SolidData";
import { useGlobalContext } from "~/app/_context/store";
import { getSharedPodDataForDisplay } from "~/app/_utils/wrangle-pods";
import { type SharedResourceStructure } from "~/types/SharedResources";
import { isEqual } from "lodash";

export default function SharedByPages() {
  const { sharedResourcesStructure } = useGlobalContext();
  // need to draw data either from state or local storage cos state is lost once page refreshes
  const sharedResourcesStructureFromLocalStorage = JSON.parse(localStorage.getItem("shared_resources_structure") ?? "{}") as SharedResourceStructure;
  const sharedBaseUrl = sharedResourcesStructure?.sharerBaseUrl ?? sharedResourcesStructureFromLocalStorage?.sharerBaseUrl;
  const currentLocation = usePathname();
  const currentLocationUrl = new URL(`${window.location.origin}${currentLocation}`);
  const segments = currentLocationUrl?.pathname?.split("/").slice(2);
  const [structure, setStructure] = useState<DocumentObject>(undefined);

  useEffect(() => {
    const resourceUrl = `${sharedBaseUrl}${segments.slice(1).join("/")}/`;
    getSharedPodDataForDisplay(resourceUrl)
      .then((result) => {
        // react chks for reference rather than value equality. so need to manually chk if result the same as structure using lodash. otherwise setStructure will continually set the state even tho result is the same, cos it is a diff obj every time
        if (!isEqual(result, structure)) {
          setStructure(result);
        }
      })
      .catch((err) => {
        console.error("cannot get nested shared page: ", err);
      });
  }, [sharedBaseUrl, segments, structure]);

  return (
    <main className={globalStyles.mainContainer}>
      <SharedBreadcrumbs />
      <CommandBar
        variant="shared"
        structure={structure}
        setStructure={setStructure}
      />
      <DisplayPodContents
        variant="shared"
        structure={structure}
        setStructure={setStructure}
      />
    </main>
  );
}
