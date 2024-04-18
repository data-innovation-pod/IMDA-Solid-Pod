"use client";

import { api } from "~/trpc/react";
import { useCallback, useMemo, useState, useEffect } from "react";
import moment from "moment";
import { cloneDeep } from "lodash";
import Pagination from "../_components/pagination/pagination";
import SortArrowIcon from "../_assets/svg/sort-arrow-icon";
import type { FilterObject, SortingProps, Audit } from "~/types/AuditTrail";
import { useGlobalContext } from "~/app/_context/store";
import styles from "./audit-trail-styles.module.css";
import { displayDataPageUp, displayDataPageDown, displayDataFirstPage, displayDataLastPage, displayDataRowsChange } from "../_utils/pagination";

export default function AuditTrailPage() {
  const { webId } = useGlobalContext();
  const [currentFilters] = useState<FilterObject>({});
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [indexRange, setIndexRange] = useState<{ start: number; end: number }>({ start: 0, end: rowsPerPage });
  const [currentSort, setCurrentSort] = useState<SortingProps[]>([
    { column: "created_at", order: "desc", nulls: "last" },
    { column: "action_type", order: "asc", nulls: "last" },
    { column: "actioner", order: "asc", nulls: "last" },
    { column: "actionee", order: "asc", nulls: "last" },
    { column: "resource_url", order: "asc", nulls: "last" },
    { column: "old_value", order: "asc", nulls: "last" },
    { column: "new_value", order: "asc", nulls: "last" },
  ]);

  const handleSortingChange = useCallback(
    (columnName: string) => {
      const newSort = cloneDeep(currentSort);
      const changingSortColumnIndex = newSort.findIndex((item) => item.column === columnName);
      if (changingSortColumnIndex !== -1) {
        const newSortObj = { ...newSort[changingSortColumnIndex]! };
        newSortObj.order = newSortObj.order === "asc" ? "desc" : "asc";

        //following two lines is to delete the sorting object at original position and making it to the first in the array
        //so that it will be the main sorting condition for the query
        newSort.splice(changingSortColumnIndex, 1);
        newSort.splice(0, 0, newSortObj);
        setCurrentSort(newSort);
      }
    },
    [currentSort]
  );

  const getColumnSort = useCallback(
    (columnName: string) => {
      return currentSort.find((item) => item.column === columnName)?.order ?? "asc";
    },
    [currentSort]
  );

  const getActionerOrActionee = useCallback(
    (actionWebId: string) => {
      return actionWebId === webId ? "Me" : actionWebId ?? "-";
    },
    [webId]
  );

  const response = api.audit.getMyAuditTrails.useQuery({ filter: currentFilters, loginWebId: webId ?? "", sort: currentSort });

  const data = response.data;
  const displayData = data?.slice(indexRange.start, indexRange.end);

  const handlePageUp = () => {
    displayDataPageUp(setIndexRange, indexRange, rowsPerPage);
  };

  const handlePageDown = () => {
    displayDataPageDown(setIndexRange, indexRange, rowsPerPage, response.data?.length ?? 0);
  };

  const handleGoFirstPage = () => {
    displayDataFirstPage(setIndexRange, rowsPerPage);
  };

  const handleGoLastPage = () => {
    displayDataLastPage(setIndexRange, indexRange, rowsPerPage, response.data?.length ?? 0);
  };

  const handleChangeRowsDisplay = (newValue: number) => {
    displayDataRowsChange(setIndexRange, indexRange, newValue);
  };

  return (
    <>
      <p className={styles.title}>History</p>
      <div className={styles.tableDiv}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.borderBottomGrey}>
              <th
                className={`${styles.tableHeader} w-[10%]`}
                onClick={() => {
                  handleSortingChange("action_type");
                }}>
                <span className={styles.tableHeaderSpan}>
                  Action Type
                  <SortArrowIcon sort={getColumnSort("action_type")} />
                </span>
              </th>
              <th
                className={`${styles.tableHeader} w-[20%]`}
                onClick={() => {
                  handleSortingChange("actioner");
                }}>
                <span className={styles.tableHeaderSpan}>
                  Action By
                  <SortArrowIcon sort={getColumnSort("actioner")} />
                </span>
              </th>
              <th
                className={`${styles.tableHeader} w-[20%]`}
                onClick={() => {
                  handleSortingChange("actionee");
                }}>
                <span className={styles.tableHeaderSpan}>
                  Action On
                  <SortArrowIcon sort={getColumnSort("actionee")} />
                </span>
              </th>
              <th
                className={`${styles.tableHeader} w-[20%]`}
                onClick={() => {
                  handleSortingChange("resource_url");
                }}>
                <span className={styles.tableHeaderSpan}>
                  Resource
                  <SortArrowIcon sort={getColumnSort("resource_url")} />
                </span>
              </th>
              <th
                className={`${styles.tableHeader} w-[10%]`}
                onClick={() => {
                  handleSortingChange("old_value");
                }}>
                <span className={styles.tableHeaderSpan}>
                  Before
                  <SortArrowIcon sort={getColumnSort("old_value")} />
                </span>
              </th>
              <th
                className={`${styles.tableHeader} w-[10%]`}
                onClick={() => {
                  handleSortingChange("new_value");
                }}>
                <span className={styles.tableHeaderSpan}>
                  After
                  <SortArrowIcon sort={getColumnSort("new_value")} />
                </span>
              </th>
              <th
                className={`${styles.tableHeader} w-[10%]`}
                onClick={() => {
                  handleSortingChange("created_at");
                }}>
                <span className={styles.tableHeaderSpan}>
                  Date & Time
                  <SortArrowIcon sort={getColumnSort("created_at")} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayData?.map((item, index) => (
              <tr
                key={index}
                className={styles.borderBottomGrey}>
                <td className={`${styles.tableColumnPrimary} w-[10%]`}>{item.action_type ?? "-"}</td>
                <td className={`${styles.tableColumnOthers} w-[20%]`}>{getActionerOrActionee(item.actioner)}</td>
                <td className={`${styles.tableColumnOthers} w-[20%]`}>{getActionerOrActionee(item.actionee)}</td>
                <td className={`${styles.tableColumnOthers} w-[20%]`}>{item.resource_url ?? "-"}</td>
                <td className={`${styles.tableColumnOthers} w-[10%] ${!item.old_value && "pl-2"}`}>{item.old_value ?? "-"}</td>
                <td className={`${styles.tableColumnOthers} w-[10%] ${!item.new_value && "pl-2"}`}>{item.new_value ?? "-"}</td>
                <td className={`${styles.tableColumnOthers} w-[10%]`}>
                  {item.created_at ? moment(item.created_at).format("yyyy-MM-DD HH:mm:ss") : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationDiv}>
        {" "}
        <Pagination
          indexRange={indexRange}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          handlePageUp={handlePageUp}
          handlePageDown={handlePageDown}
          handleGoFirstPage={handleGoFirstPage}
          handleGoLastPage={handleGoLastPage}
          handleChangeRowsDisplay={handleChangeRowsDisplay}
          total={response?.data?.length ?? 0}
        />
      </div>
    </>
  );
}
