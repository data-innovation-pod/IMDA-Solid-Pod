import { cloneDeep } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { type Audit } from "~/types/AuditTrail";
import Pagination from "../pagination/pagination";
import moment from "moment";
import styles from "./shared-resources-table.module.css";
import modalStyles from "../../_components/pod-display/pod-display-styles.module.css";
import globalStyles from "../../../styles/global-styles.module.css";
import { downloadResource } from "~/app/_utils/wrangle-pods";
import { useGlobalContext } from "~/app/_context/store";
import Link from "next/link";
import { displayDataPageUp, displayDataPageDown, displayDataFirstPage, displayDataLastPage, displayDataRowsChange } from "../../_utils/pagination";

interface SharedResourcesTableProps {
  user?: string;
  resources: Audit[];
}
interface DisplayDownloadModalProps {
  openModal: {
    modalOpen: boolean;
    resourceUrl?: string;
    resourceName?: string;
  };
  setOpenModal: React.Dispatch<
    React.SetStateAction<{
      modalOpen: boolean;
      resourceUrl?: string;
      resourceName?: string;
    }>
  >;
}

export default function SharedResourcesTable({ resources, user }: Readonly<SharedResourcesTableProps>) {
  const { webId, setSharedResourcesStructure } = useGlobalContext();
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [indexRange, setIndexRange] = useState<{ start: number; end: number }>({ start: 0, end: rowsPerPage });
  const [openModal, setOpenModal] = useState<DisplayDownloadModalProps["openModal"]>({
    modalOpen: false,
    resourceUrl: undefined,
    resourceName: undefined,
  });
  const userUrl = new URL(user ?? "");
  const usableUserUrl = `/sharedby/${userUrl.host}${userUrl.pathname.replaceAll("/", "_")}/`;

  function handleClickResource(resourceUrl: string | undefined, resourceName: string) {
    setOpenModal((prev) => ({ ...prev, resourceUrl: resourceUrl, resourceName: resourceName, modalOpen: true }));
  }

  async function downloadClickedResource() {
    await downloadResource(openModal.resourceUrl ?? "", openModal.resourceName ?? "", webId ?? "", user);
    setOpenModal((prev) => ({ ...prev, resourceUrl: undefined, resourceName: undefined, modalOpen: false }));
  }

  function handleClickLink(resourceUrl: string | undefined, actioner: string | undefined) {
    const sampleUrl = new URL(resources[0]?.resource_url ?? "");
    const userPath = sampleUrl?.pathname?.split("/")[1];
    const sharedResourcesStructure = { url: resourceUrl ?? "", sharerBaseUrl: `${sampleUrl.origin}/${userPath}/`, sharerWebId: actioner };
    // store data in both state and localStorage for use when app is refreshed
    localStorage.setItem("shared_resources_structure", JSON.stringify(sharedResourcesStructure));
    setSharedResourcesStructure?.(sharedResourcesStructure);
  }

  const handlePageUp = () => {
    displayDataPageUp(setIndexRange, indexRange, rowsPerPage);
  };

  const handlePageDown = () => {
    displayDataPageDown(setIndexRange, indexRange, rowsPerPage, resources.length ?? 0);
  };

  const handleGoFirstPage = () => {
    displayDataFirstPage(setIndexRange, rowsPerPage);
  };

  const handleGoLastPage = () => {
    displayDataLastPage(setIndexRange, indexRange, rowsPerPage, resources.length ?? 0);
  };

  const handleChangeRowsDisplay = (newValue: number) => {
    displayDataRowsChange(setIndexRange, indexRange, newValue);
  };

  const displayData = resources.slice(indexRange.start, indexRange.end);

  return (
    <>
      <div className={styles.tableDiv}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.borderBottomGrey}>
              <th className={`${styles.tableHeaderUrl}`}>
                <span className={styles.tableHeaderSpan}>Resources</span>
              </th>
              <th className={styles.tableHeaderOthers}>
                <span className={styles.tableHeaderSpan}>Permission</span>
              </th>
              <th className={styles.tableHeaderOthers}>
                <span className={styles.tableHeaderSpan}>Date & Time of Sharing</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((item, index) => {
              const isFolder = item.resource_url.endsWith("/");
              const rawlastSegmentPath = item.resource_url.match(/([^/]+\/?)$/)?.[0];
              const cleanedLastSegmentPath = decodeURIComponent(rawlastSegmentPath ?? "");
              return (
                <tr
                  key={index}
                  className={styles.borderBottomGrey}>
                  <td className={styles.tableColumnUrl}>
                    {isFolder ? (
                      <Link
                        onClick={() => handleClickLink(item.resource_url, item.actioner)}
                        href={`${usableUserUrl}${cleanedLastSegmentPath}`}
                        className={styles.tableColumnUrlLink}>
                        {item.resource_url ?? "-"}
                      </Link>
                    ) : (
                      <span onClick={() => handleClickResource(item.resource_url, item.resource_url.split("/").slice(-1)[0] ?? "file")}>
                        {item.resource_url ?? "-"}
                      </span>
                    )}
                  </td>
                  {item.new_value === "EDITOR" ? (
                    <td className={styles.tableColumnOthers}>READ AND EDIT</td>
                  ) : item.new_value === "VIEWER" ? (
                    <td className={styles.tableColumnOthers}>READ ONLY</td>
                  ) : (
                    <td className={styles.tableColumnOthers}> -- </td>
                  )}
                  <td className={styles.tableColumnOthers}>{item.created_at ? moment(item.created_at).format("yyyy-MM-DD HH:mm:ss") : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
          total={resources.length ?? 0}
        />
      </div>
      {openModal.modalOpen && (
        <div className={modalStyles.contactsModalContainer}>
          <div className={modalStyles.modalInner}>
            <button
              className={modalStyles.closeModal}
              onClick={() => setOpenModal((prev) => ({ ...prev, resourceUrl: undefined, resourceName: undefined, modalOpen: false }))}
              type="button">
              X
            </button>
            <div className={modalStyles.profileContainer}>
              <p className={styles.titleText}>Do you want to download this resource?</p>
              <div className={styles.buttonContainer}>
                <button
                  className={globalStyles.primaryButton}
                  onClick={() => downloadClickedResource()}>
                  Yes
                </button>
                <button
                  className={globalStyles.secondaryButton}
                  onClick={() => setOpenModal((prev) => ({ ...prev, resourceUrl: undefined, resourceName: undefined, modalOpen: false }))}>
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
