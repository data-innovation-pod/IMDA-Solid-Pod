"use client";

import styles from "./pod-display-styles.module.css";
import type { PodDataItemProps, NormalPodDataItemProps, ContactsPodDataItemProps, SharedPodDataItemProps } from "~/types/JsxComponents";
import { downloadResource, viewContactProfile, getProfileImage } from "~/app/_utils/wrangle-pods";
import { useContactProfileContext } from "./display-pod-contents";
import { useGlobalContext } from "~/app/_context/store";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Pagination from "../pagination/pagination";

import PodDataNormalRowItem from "./pod-data-normal-row-item";
import PodDataSharedRowItem from "./pod-data-shared-row-item";
import PodDataContactsRowItem from "./pod-data-contacts-row-item";
import { type DeleteConfirmationModalHandle, type DeleteResultModalHandle, DeleteConfirmationModal, DeleteResultModal } from "../common";
import { type SharedResourceStructure } from "~/types/SharedResources";
import { displayDataPageUp, displayDataPageDown, displayDataFirstPage, displayDataLastPage, displayDataRowsChange } from "../../_utils/pagination";

export default function PodDataItem(props: PodDataItemProps) {
  const { webId } = useGlobalContext();
  const deleteConfirmationModalRef = useRef<DeleteConfirmationModalHandle>(null);
  const deleteResultModalRef = useRef<DeleteResultModalHandle>(null);

  return (
    <>
      {props.variant === "pod" ? (
        <NormalPodDataItem
          deleteConfirmationModalRef={deleteConfirmationModalRef}
          structure={props.structure}
          setStructure={props.setStructure}
          webId={webId}
          detailColumnRef={props.detailColumnRef}
          currentSort={props.currentSort}
          variant={props.variant}
        />
      ) : null}
      {props.variant === "contacts" ? (
        <ContactsPodDataItem
          deleteConfirmationModalRef={deleteConfirmationModalRef}
          structure={props.structure}
          setStructure={props.setStructure}
          webId={webId}
          currentSort={props.currentSort}
          variant={props.variant}
        />
      ) : null}
      {props.variant === "shared" ? (
        <SharedPodDataItem
          deleteConfirmationModalRef={deleteConfirmationModalRef}
          structure={props.structure}
          setStructure={props.setStructure}
          webId={webId}
          currentSort={props.currentSort}
          variant={props.variant}
        />
      ) : null}
      <DeleteConfirmationModal
        ref={deleteConfirmationModalRef}
        deleteResultModalRef={deleteResultModalRef}
      />
      <DeleteResultModal ref={deleteResultModalRef} />
    </>
  );
}

function NormalPodDataItem({ structure, webId, deleteConfirmationModalRef, detailColumnRef, currentSort }: Readonly<NormalPodDataItemProps>) {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [indexRange, setIndexRange] = useState<{ start: number; end: number }>({ start: 0, end: rowsPerPage });

  const { colName, order } = currentSort;

  function handleDetailsClick(resourceUrl: string | undefined) {
    detailColumnRef?.current?.updateResourceUrl(resourceUrl);
    detailColumnRef?.current?.show();
  }

  function handleCopyLink(resourceUrl: string | undefined) {
    void navigator.clipboard.writeText(resourceUrl ?? "");
  }

  function handleDeleteResource(resourceUrl: string | undefined) {
    deleteConfirmationModalRef?.current?.updateUrlToDelete(resourceUrl);
  }

  async function handleDownloadResource(resourceUrl: string | undefined, key: string) {
    await downloadResource(resourceUrl ?? "", key, webId ?? "");
  }

  const handlePageUp = () => {
    displayDataPageUp(setIndexRange, indexRange, rowsPerPage);
  };

  const handlePageDown = () => {
    displayDataPageDown(setIndexRange, indexRange, rowsPerPage, sortedEntries.length ?? 0);
  };

  const handleGoFirstPage = () => {
    displayDataFirstPage(setIndexRange, rowsPerPage);
  };

  const handleGoLastPage = () => {
    displayDataLastPage(setIndexRange, indexRange, rowsPerPage, sortedEntries.length ?? 0);
  };

  const handleChangeRowsDisplay = (newValue: number) => {
    displayDataRowsChange(setIndexRange, indexRange, newValue);
  };

  const sortedEntries = useMemo(() => {
    if (!structure) {
      return [];
    }

    if (colName === "name") {
      return order === "desc"
        ? Object.entries(structure).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        : Object.entries(structure).sort(([keyA], [keyB]) => keyB.localeCompare(keyA));
    }

    return order === "desc"
      ? Object.entries(structure).sort(([_A, docInfoA], [_B, docInfoB]) => {
          const [valA, valB] = [docInfoA[colName], docInfoB[colName]];
          if (!valA) {
            return 1;
          } else if (!valB) {
            return -1;
          } else {
            return valA.localeCompare(valB);
          }
        })
      : Object.entries(structure).sort(([_A, docInfoA], [_B, docInfoB]) => {
          const [valA, valB] = [docInfoA[colName], docInfoB[colName]];
          if (!valA) {
            return -1;
          } else if (!valB) {
            return 1;
          } else {
            return valB.localeCompare(valA);
          }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colName, order, Object.keys(structure ?? []).join()]);

  const displayData = sortedEntries?.slice(indexRange.start, indexRange.end);

  if (!structure) return;

  return (
    <>
      {displayData.map(([key, docInfo], index) => {
        return (
          <PodDataNormalRowItem
            key={key}
            docInfo={docInfo}
            folderName={key}
            handleCopyLink={handleCopyLink}
            handleDeleteResource={handleDeleteResource}
            handleDetailsClick={handleDetailsClick}
            handleDownloadResource={handleDownloadResource}
            index={index}
          />
        );
      })}
      <div className={styles.paginationDiv}>
        <Pagination
          indexRange={indexRange}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          handlePageUp={handlePageUp}
          handlePageDown={handlePageDown}
          handleGoFirstPage={handleGoFirstPage}
          handleGoLastPage={handleGoLastPage}
          handleChangeRowsDisplay={handleChangeRowsDisplay}
          total={Object.keys(structure).length ?? 0}
        />
      </div>
    </>
  );
}

function ContactsPodDataItem({ currentSort, deleteConfirmationModalRef, structure }: Readonly<ContactsPodDataItemProps>) {
  const { colName, order } = currentSort;
  const { setContactProfile, setOpenDisplayPodModal } = useContactProfileContext();
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [indexRange, setIndexRange] = useState<{ start: number; end: number }>({ start: 0, end: rowsPerPage });

  function handleDeleteResource(resourceUrl: string | undefined) {
    deleteConfirmationModalRef?.current?.updateUrlToDelete(resourceUrl);
  }

  async function handleViewProfile(webIdUrl: string | undefined) {
    setOpenDisplayPodModal?.((prev) => !prev);
    const [webIdThingName, webIdThingEmail] = await viewContactProfile(webIdUrl);
    const profileImage = await getProfileImage(webIdUrl ?? "");
    const profileImageUrl = profileImage ? profileImage?.internal_resourceInfo.sourceIri : "";
    setContactProfile?.((prevProfile) => ({
      ...prevProfile,
      name: webIdThingName ?? "",
      email: webIdThingEmail ?? "",
      webId: webIdUrl ?? "",
      profileUrl: profileImageUrl,
    }));
  }

  const handlePageUp = () => {
    displayDataPageUp(setIndexRange, indexRange, rowsPerPage);
  };

  const handlePageDown = () => {
    displayDataPageDown(setIndexRange, indexRange, rowsPerPage, sortedEntries.length ?? 0);
  };

  const handleGoFirstPage = () => {
    displayDataFirstPage(setIndexRange, rowsPerPage);
  };

  const handleGoLastPage = () => {
    displayDataLastPage(setIndexRange, indexRange, rowsPerPage, sortedEntries.length ?? 0);
  };

  const handleChangeRowsDisplay = (newValue: number) => {
    displayDataRowsChange(setIndexRange, indexRange, newValue);
  };

  const sortedEntries = useMemo(() => {
    if (!structure) {
      return [];
    }

    return order === "desc"
      ? Object.entries(structure).sort(([_A, docInfoA], [_B, docInfoB]) => {
          const [valA, valB] = [docInfoA[colName], docInfoB[colName]];
          if (!valA) {
            return 1;
          } else if (!valB) {
            return -1;
          } else {
            return valA.localeCompare(valB);
          }
        })
      : Object.entries(structure).sort(([_A, docInfoA], [_B, docInfoB]) => {
          const [valA, valB] = [docInfoA[colName], docInfoB[colName]];
          if (!valA) {
            return -1;
          } else if (!valB) {
            return 1;
          } else {
            return valB.localeCompare(valA);
          }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colName, order, Object.keys(structure ?? []).join()]);

  const displayData = sortedEntries?.slice(indexRange.start, indexRange.end);

  if (!structure) return;

  return (
    <>
      {displayData.map(([key, value], index) => {
        return (
          <PodDataContactsRowItem
            key={key}
            docInfo={value}
            handleDeleteResource={handleDeleteResource}
            handleViewProfile={handleViewProfile}
            index={index}
          />
        );
      })}
      <div className={styles.paginationDiv}>
        <Pagination
          indexRange={indexRange}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          handlePageUp={handlePageUp}
          handlePageDown={handlePageDown}
          handleGoFirstPage={handleGoFirstPage}
          handleGoLastPage={handleGoLastPage}
          handleChangeRowsDisplay={handleChangeRowsDisplay}
          total={Object.keys(structure).length ?? 0}
        />
      </div>
    </>
  );
}

function SharedPodDataItem({ currentSort, deleteConfirmationModalRef, structure, webId }: Readonly<SharedPodDataItemProps>) {
  const { colName, order } = currentSort;
  const currentLocation = usePathname();
  const { sharedResourcesStructure } = useGlobalContext();
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [indexRange, setIndexRange] = useState<{ start: number; end: number }>({ start: 0, end: rowsPerPage });

  async function handleDownloadResource(resourceUrl: string | undefined, key: string, sharerWebId: string | undefined) {
    await downloadResource(resourceUrl ?? "", key, webId ?? "", sharerWebId ?? "");
  }

  function handleCopyLink(resourceUrl: string | undefined) {
    void navigator.clipboard.writeText(resourceUrl ?? "");
  }

  const sharedResourcesStructureFromLocalStorage = JSON.parse(localStorage.getItem("shared_resources_structure") ?? "{}") as SharedResourceStructure;
  const sharerWebId = sharedResourcesStructure?.sharerWebId ?? sharedResourcesStructureFromLocalStorage?.sharerWebId;

  function handleDeleteResource(resourceUrl: string | undefined) {
    deleteConfirmationModalRef?.current?.updateUrlToDelete(resourceUrl);
    deleteConfirmationModalRef?.current?.updateSharerWebId(sharerWebId);
  }

  const handlePageUp = () => {
    displayDataPageUp(setIndexRange, indexRange, rowsPerPage);
  };

  const handlePageDown = () => {
    displayDataPageDown(setIndexRange, indexRange, rowsPerPage, sortedEntries.length ?? 0);
  };

  const handleGoFirstPage = () => {
    displayDataFirstPage(setIndexRange, rowsPerPage);
  };

  const handleGoLastPage = () => {
    displayDataLastPage(setIndexRange, indexRange, rowsPerPage, sortedEntries.length ?? 0);
  };

  const handleChangeRowsDisplay = (newValue: number) => {
    displayDataRowsChange(setIndexRange, indexRange, newValue);
  };

  const sortedEntries = useMemo(() => {
    if (!structure) {
      return [];
    }

    return order === "desc"
      ? Object.entries(structure).sort(([_A, docInfoA], [_B, docInfoB]) => {
          const [valA, valB] = [docInfoA[colName], docInfoB[colName]];
          if (!valA) {
            return 1;
          } else if (!valB) {
            return -1;
          } else {
            return valA.localeCompare(valB);
          }
        })
      : Object.entries(structure).sort(([_A, docInfoA], [_B, docInfoB]) => {
          const [valA, valB] = [docInfoA[colName], docInfoB[colName]];
          if (!valA) {
            return -1;
          } else if (!valB) {
            return 1;
          } else {
            return valB.localeCompare(valA);
          }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colName, order, Object.keys(structure ?? []).join()]);

  const displayData = sortedEntries?.slice(indexRange.start, indexRange.end);

  if (!structure) return;

  return (
    <>
      {displayData.map(([key, value]) => (
        <PodDataSharedRowItem
          key={key}
          currentLocation={currentLocation}
          docInfo={value}
          handleCopyLink={handleCopyLink}
          handleDeleteResource={handleDeleteResource}
          handleDownloadResource={handleDownloadResource}
          sharerWebId={sharerWebId}
          webId={key}
        />
      ))}
      <div className={styles.paginationDiv}>
        <Pagination
          indexRange={indexRange}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          handlePageUp={handlePageUp}
          handlePageDown={handlePageDown}
          handleGoFirstPage={handleGoFirstPage}
          handleGoLastPage={handleGoLastPage}
          handleChangeRowsDisplay={handleChangeRowsDisplay}
          total={Object.keys(structure).length ?? 0}
        />
      </div>
    </>
  );
}
