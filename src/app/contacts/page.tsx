"use client";

import { useEffect, useState } from "react";
import { useGlobalContext } from "~/app/_context/store";
import { getContactsForDisplay } from "~/app/_utils";
import DisplayPodContents from "../_components/pod-display/display-pod-contents";
import { type DocumentObject } from "~/types/SolidData";
import { Breadcrumbs, CommandBar } from "../_components/layout";

export default function ContactsPage() {
  const [structure, setStructure] = useState<DocumentObject>(undefined);

  const { podUrl } = useGlobalContext();
  const contactsSolidDataUrl = `${podUrl}contacts/`;

  useEffect(() => {
    if (podUrl) {
      getContactsForDisplay(contactsSolidDataUrl)
        .then((result) => {
          setStructure(result);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [contactsSolidDataUrl, podUrl]);

  return (
    <>
      <Breadcrumbs />
      <CommandBar
        structure={structure}
        setStructure={setStructure}
        variant="contacts"
      />
      <DisplayPodContents
        structure={structure}
        setStructure={setStructure}
        variant="contacts"
      />
    </>
  );
}
