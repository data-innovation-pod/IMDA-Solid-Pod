"use client";

import PodDataHeader from "./pod-data-header";
import PodDataItem from "./pod-data-item";
import DisplayPodModal from "./display-pod-modal";
import type {
  DisplayPodContentsProps,
  NormalPodColName,
  ContactsPodColName,
  NormalPodSort,
  ContactsPodSort,
  SharedPodColName,
  SharedPodSort,
} from "~/types/JsxComponents";
import { useState, createContext, useContext, type ReactNode, type Dispatch, type SetStateAction } from "react";

interface ContactProfileContextProps {
  contactProfile?: { name?: string; email?: string; profileUrl?: string; webId?: string };
  setContactProfile?: Dispatch<SetStateAction<{ name?: string; email?: string; profileUrl?: string; webId?: string } | undefined>>;
  openDisplayPodModal?: boolean;
  setOpenDisplayPodModal?: Dispatch<SetStateAction<boolean>>;
}

const ContactProfileContext = createContext<ContactProfileContextProps>({});

function ContactProfileContextProvider({ children }: { children: ReactNode }) {
  const [contactProfile, setContactProfile] = useState<{ name?: string; email?: string; webId?: string } | undefined>({});
  const [openDisplayPodModal, setOpenDisplayPodModal] = useState(false);

  return (
    <ContactProfileContext.Provider
      value={{
        contactProfile,
        setContactProfile,
        openDisplayPodModal,
        setOpenDisplayPodModal,
      }}>
      {children}
    </ContactProfileContext.Provider>
  );
}

export function useContactProfileContext() {
  return useContext(ContactProfileContext);
}

export default function DisplayPodContents(props: DisplayPodContentsProps) {
  const [currentNormalSort, setCurrentNormalSort] = useState<NormalPodSort>({ colName: "name", order: "desc" });
  const [currentSharedSort, setCurrentSharedSort] = useState<SharedPodSort>({ colName: "name", order: "desc" });
  const [currentContactsSort, setCurrentContactsSort] = useState<ContactsPodSort>({ colName: "name", order: "desc" });

  function createNormalUpdateSort(newColName: NormalPodColName) {
    const { colName, order } = currentNormalSort;
    return () => {
      if (newColName === colName) {
        if (order === "desc") {
          setCurrentNormalSort((prev) => ({
            ...prev,
            order: "asc",
          }));
        } else {
          setCurrentNormalSort((prev) => ({
            ...prev,
            order: "desc",
          }));
        }
      } else {
        setCurrentNormalSort({
          colName: newColName,
          order: "desc",
        });
      }
    };
  }

  function createSharedUpdateSort(newColName: SharedPodColName) {
    const { colName, order } = currentSharedSort;
    return () => {
      if (newColName === colName) {
        if (order === "desc") {
          setCurrentSharedSort((prev) => ({
            ...prev,
            order: "asc",
          }));
        } else {
          setCurrentSharedSort((prev) => ({
            ...prev,
            order: "desc",
          }));
        }
      } else {
        setCurrentSharedSort({
          colName: newColName,
          order: "desc",
        });
      }
    };
  }

  function createContactUpdateSort(newColName: ContactsPodColName) {
    const { colName, order } = currentContactsSort;
    return () => {
      if (newColName === colName) {
        if (order === "desc") {
          setCurrentContactsSort((prev) => ({
            ...prev,
            order: "asc",
          }));
        } else {
          setCurrentContactsSort((prev) => ({
            ...prev,
            order: "desc",
          }));
        }
      } else {
        setCurrentContactsSort({
          colName: newColName,
          order: "desc",
        });
      }
    };
  }

  return (
    <div
      data-testid="cy-pod-content"
      className={props.className}>
      {props.variant === "pod" ? (
        <>
          <PodDataHeader
            structure={props.structure}
            setStructure={props.setStructure}
            variant={props.variant}
            currentSort={currentNormalSort}
            createUpdateSort={createNormalUpdateSort}
          />
          <PodDataItem
            structure={props.structure}
            setStructure={props.setStructure}
            variant={props.variant}
            detailColumnRef={props.detailColumnRef}
            currentSort={currentNormalSort}
          />
          <DisplayPodModal />
        </>
      ) : null}
      {props.variant === "contacts" ? (
        <>
          <PodDataHeader
            structure={props.structure}
            setStructure={props.setStructure}
            variant={props.variant}
            currentSort={currentContactsSort}
            createUpdateSort={createContactUpdateSort}
          />
          <ContactProfileContextProvider>
            <PodDataItem
              structure={props.structure}
              setStructure={props.setStructure}
              variant={props.variant}
              currentSort={currentContactsSort}
            />
            <DisplayPodModal />
          </ContactProfileContextProvider>
        </>
      ) : null}
      {props.variant === "shared" ? (
        <>
          <PodDataHeader
            structure={props.structure}
            setStructure={props.setStructure}
            variant={props.variant}
            currentSort={currentSharedSort}
            createUpdateSort={createSharedUpdateSort}
          />
          <PodDataItem
            structure={props.structure}
            setStructure={props.setStructure}
            variant={props.variant}
            currentSort={currentSharedSort}
          />
          <DisplayPodModal />
        </>
      ) : null}
    </div>
  );
}
