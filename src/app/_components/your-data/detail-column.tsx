"use client";

import { CrossIcon, EditUserIcon, FileIcon, FolderIcon } from "~/app/_assets/svg";
import EditModal, { type EditModalHandle } from "./edit-modal";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

import styles from "./your-data-styles.module.css";
import { mergeClassnames } from "~/app/_utils";

import {
  type SolidDataset,
  type WithAcl,
  type WithServerResourceInfo,
  getAgentAccessAll,
  getFileWithAcl,
  getSolidDatasetWithAcl,
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { useGlobalContext } from "~/app/_context/store";
import { getNameEmailFromOriginalWebId, getProfileImage } from "~/app/_utils/wrangle-pods";
import DetailColumnRowItem from "./detail-column-row-item";

export type User = {
  name: string | null | undefined;
  webId: string;
  profileImageUrl: string | null;
};
export interface DetailColumnHandle {
  show: () => void;
  hide: () => void;
  updateResourceUrl: (resourceUrl: string | undefined) => void;
}

const DetailColumn = forwardRef<DetailColumnHandle>(function DetailColumn(_, ref) {
  const { webId } = useGlobalContext();

  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [resourceUrl, setResourceUrl] = useState<string>();
  const [editors, setEditors] = useState<User[]>([]);
  const [viewers, setViewers] = useState<User[]>([]);

  const editModalRef = useRef<EditModalHandle>(null);

  const isFolder = resourceUrl?.endsWith("/");
  const splitUrl = resourceUrl?.split("/");

  let title = "Not defined";
  if (splitUrl) {
    const urlLength = splitUrl.length;
    title = isFolder ? splitUrl[urlLength - 2]! : splitUrl[urlLength - 1]!;
  }

  const getEditorsAndViewers = useCallback(async () => {
    if (!resourceUrl) return;

    let solidDataset: (SolidDataset | Blob) & WithServerResourceInfo & WithAcl;
    if (resourceUrl.endsWith("/")) {
      solidDataset = await getSolidDatasetWithAcl(resourceUrl, { fetch });
    } else {
      solidDataset = await getFileWithAcl(resourceUrl, { fetch });
    }

    const authorisedUsers = getAgentAccessAll(solidDataset);

    if (!authorisedUsers) throw new Error("authorisedUsers object is empty");

    const currentEditors: string[] = [];
    const currentViewers: string[] = [];
    for (const [currentWebId, access] of Object.entries(authorisedUsers)) {
      if (currentWebId === webId) continue;

      if (access.write) {
        currentEditors.push(currentWebId);
      } else if (access.read) {
        currentViewers.push(currentWebId);
      }
    }

    const editorPromises: Promise<User>[] = currentEditors.map(async (webId) => {
      const [name] = await getNameEmailFromOriginalWebId(webId);
      const profileImage = await getProfileImage(webId);
      const profileImageUrl = profileImage ? profileImage.internal_resourceInfo.sourceIri : "";
      return { name: name!, webId, profileImageUrl };
    });
    const viewerPromises: Promise<User>[] = currentViewers.map(async (webId) => {
      const [name] = await getNameEmailFromOriginalWebId(webId);
      const profileImage = await getProfileImage(webId);
      const profileImageUrl = profileImage ? profileImage.internal_resourceInfo.sourceIri : "";
      return { name: name!, webId, profileImageUrl };
    });

    const processedEditors = await Promise.all(editorPromises);
    const processedViewers = await Promise.all(viewerPromises);

    setEditors(processedEditors);
    setViewers(processedViewers);
  }, [resourceUrl, webId]);

  useImperativeHandle(ref, () => ({
    show() {
      setIsShowing(true);
    },
    hide() {
      setIsShowing(false);
    },
    updateResourceUrl(resourceUrl) {
      setResourceUrl(resourceUrl);
    },
  }));

  function handleChangeEditors() {
    editModalRef.current?.updateRole("Editor");
    editModalRef.current?.show();
  }

  function handleChangeViewers() {
    editModalRef.current?.updateRole("Viewer");
    editModalRef.current?.show();
  }

  useEffect(() => {
    void getEditorsAndViewers();
  }, [getEditorsAndViewers, resourceUrl]);

  return (
    <>
      <div
        className={mergeClassnames(
          styles.detailColumnPadder,
          styles.detailColumnContainer,
          "@container 3xl:px-0 3xl:py-0 px-6 py-4",
          isShowing ? "block" : "hidden"
        )}>
        <div className={styles.detailColumnTitleContainer}>
          <span className="text-[20px]">View Details/Share</span>
          <button onClick={() => setIsShowing(false)}>
            <CrossIcon />
          </button>
        </div>

        <div className={styles.docTypeContainer}>
          {isFolder ? <FolderIcon /> : <FileIcon />}
          <span>{decodeURIComponent(title)}</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.editUserContainer}>
          <span className="font-semibold">Allow Read and Edit</span>
          <button
            onClick={handleChangeEditors}
            className={styles.button}>
            <EditUserIcon />
            <span className="whitespace-nowrap text-sm">Add/Remove</span>
          </button>
        </div>
        <span className={styles.editUserDesc}>Can view, edit, and delete this resource</span>
        <div className={styles.usersContainer}>
          {editors.map((user, index) => (
            <DetailColumnRowItem
              key={index}
              user={user}
            />
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.editUserContainer}>
          <span className="font-semibold">Allow Read Only</span>
          <button
            onClick={handleChangeViewers}
            className={styles.button}>
            <EditUserIcon />
            <span className="whitespace-nowrap text-sm">Add/Remove</span>
          </button>
        </div>
        <span className={styles.editUserDesc}>Can view but cannot edit or delete this resource</span>
        <div className={styles.usersContainer}>
          {viewers.map((user, index) => (
            <DetailColumnRowItem
              key={index}
              user={user}
            />
          ))}
        </div>
      </div>
      {/* Paddder to shift the main section */}
      <div className={mergeClassnames(styles.detailColumnPadder, isShowing ? "block" : "hidden")} />
      <EditModal
        ref={editModalRef}
        folderName={title}
        isFolder={isFolder}
        resourceUrl={resourceUrl}
        onSaveCallback={getEditorsAndViewers}
      />
    </>
  );
});

export default DetailColumn;
