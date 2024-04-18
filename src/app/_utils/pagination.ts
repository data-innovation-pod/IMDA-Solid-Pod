import { type Dispatch, type SetStateAction } from "react";

interface IndexRange {
  start: number;
  end: number;
}

export function displayDataPageUp(setState: Dispatch<SetStateAction<IndexRange>>, currentRange: IndexRange, rowsPerPage: number): void {
  setState({
    start: currentRange.end,
    end: currentRange.end + rowsPerPage,
  });
}

export function displayDataPageDown(
  setState: Dispatch<SetStateAction<IndexRange>>,
  currentRange: IndexRange,
  rowsPerPage: number,
  totalRecords: number
): void {
  if (currentRange.end === totalRecords) {
    setState({
      start: currentRange.start - rowsPerPage,
      end: currentRange.start,
    });
  } else {
    setState({
      start: currentRange.start - rowsPerPage < 0 ? 0 : currentRange.start - rowsPerPage,
      end: currentRange.start - rowsPerPage < 0 ? rowsPerPage : currentRange.end - rowsPerPage,
    });
  }
}

export function displayDataFirstPage(setState: Dispatch<SetStateAction<IndexRange>>, rowsPerPage: number): void {
  setState({
    start: 0,
    end: rowsPerPage,
  });
}

export function displayDataLastPage(
  setState: Dispatch<SetStateAction<IndexRange>>,
  currentRange: IndexRange,
  rowsPerPage: number,
  totalRecords: number
): void {
  const remainingRows = (totalRecords - currentRange.end) % rowsPerPage;
  const lastPageStartIndex = totalRecords - remainingRows;

  if (remainingRows > 0) {
    setState({
      start: lastPageStartIndex <= currentRange.end ? currentRange.end : lastPageStartIndex,
      end: totalRecords,
    });
  } else {
    const newStart = Math.max(lastPageStartIndex - rowsPerPage, 0);
    setState({
      start: newStart,
      end: totalRecords,
    });
  }
}

export function displayDataRowsChange(setState: Dispatch<SetStateAction<IndexRange>>, currentRange: IndexRange, newValue: number): void {
  setState({ start: currentRange.start, end: currentRange.start + newValue });
}
