"use client";

import { type NestedDynamicPageProps } from "~/types/JsxComponents";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "~/app/_context/store";
import { getPodDataForDisplay } from "~/app/_utils";
import DisplayPodContents from "~/app/_components/pod-display/display-pod-contents";
import { type DocumentObject } from "~/types/SolidData";
import globalStyles from "../../../styles/global-styles.module.css";
import CommandBar from "~/app/_components/layout/command-bar";
import Breadcrumbs from "~/app/_components/layout/breadcrumbs";
import { DetailColumn } from "~/app/_components/your-data";
import { type DetailColumnHandle } from "~/app/_components/your-data/detail-column";

export default function NestedYourDataPages({ params }: NestedDynamicPageProps) {
  const { podUrl } = useGlobalContext();
  const [structure, setStructure] = useState<DocumentObject>(undefined);
  const solidUrl = params.pathSegment ? `${podUrl}${params.pathSegment.join("/")}/` : podUrl;
  const detailColumnRef = useRef<DetailColumnHandle>(null);

  useEffect(() => {
    if (solidUrl) {
      getPodDataForDisplay(solidUrl)
        .then((result) => {
          setStructure(result);
        })
        .catch((err) => {
          console.error("cannot get nested page: ", err);
        });
    }
  }, [solidUrl]);

  return (
    <>
      <main className={globalStyles.mainContainer}>
        <Breadcrumbs />
        <CommandBar
          structure={structure}
          setStructure={setStructure}
          variant="pod"
        />
        <DisplayPodContents
          structure={structure}
          setStructure={setStructure}
          variant="pod"
          detailColumnRef={detailColumnRef}
        />
      </main>
      <DetailColumn ref={detailColumnRef} />{" "}
    </>
  );
}
