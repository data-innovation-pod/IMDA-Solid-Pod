import { useMemo } from "react";
import Chevron from "~/app/_assets/svg/chevron";
import ToFirstLastArrow from "~/app/_assets/svg/to-first-last-arrow";
import Dropdown, { type DropdownItemsProps } from "../dropdown/dropdown";
interface PaginationProps {
  rowsPerPage: number;
  setRowsPerPage?: (value: number) => void;
  indexRange?: { start: number; end: number };
  total: number;
  handlePageUp?: () => void;
  handlePageDown?: () => void;
  handleGoFirstPage?: () => void;
  handleGoLastPage?: () => void;
  handleChangeRowsDisplay?: (value: number) => void;
}

const rowsPerPageSelections = [10, 20, 50, 100];

export default function Pagination({
  indexRange,
  rowsPerPage = 10,
  total,
  setRowsPerPage,
  handlePageUp,
  handlePageDown,
  handleGoFirstPage,
  handleGoLastPage,
  handleChangeRowsDisplay,
}: Readonly<PaginationProps>) {
  const dropdownItems = useMemo((): DropdownItemsProps<number>[] => {
    return rowsPerPageSelections.map((item) => {
      return {
        key: item,
        value: item,
      };
    });
  }, []);

  return (
    <div className="flex gap-2">
      <p className="py-2 text-grey-default">Rows Per Page</p>

      <Dropdown
        selectedValue={rowsPerPage}
        options={dropdownItems}
        setSelectedValue={setRowsPerPage}
        handleChangeRowsDisplay={handleChangeRowsDisplay}
      />
      <p className="py-2 text-grey-default">
        {indexRange && (
          <span>
            {indexRange?.start + 1}-{Math.min(indexRange?.end, total)} of {total}
          </span>
        )}
      </p>
      <div className="flex gap-3 py-1">
        <button
          onClick={() => {
            handleGoFirstPage?.();
          }}
          type="button">
          <ToFirstLastArrow direction={"left"} />
        </button>{" "}
        <button
          disabled={indexRange && indexRange?.start < 1}
          onClick={() => {
            handlePageDown?.();
          }}
          type="button">
          <Chevron direction={"left"} />
        </button>{" "}
        <button
          disabled={indexRange && indexRange?.end >= total}
          onClick={() => {
            handlePageUp?.();
          }}
          type="button">
          <Chevron direction={"right"} />
        </button>
        <button
          disabled={indexRange && indexRange?.end >= total}
          onClick={() => {
            handleGoLastPage?.();
          }}
          type="button">
          <ToFirstLastArrow direction={"right"} />
        </button>{" "}
      </div>
    </div>
  );
}
