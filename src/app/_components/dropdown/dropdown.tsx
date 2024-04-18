"use client";

import { useEffect, useRef, useState } from "react";
import DropdownArrow from "~/app/_assets/svg/dropdown-arrow";
import styles from "./dropdown-styles.module.css";
interface DropdownProps<T> {
  selectedValue: T;
  setSelectedValue?: (value: T) => void;
  handleChangeRowsDisplay?: (value: T) => void;
  options: DropdownItemsProps<T>[];
}

export interface DropdownItemsProps<T> {
  key: string | number;
  value: T;
}

const Dropdown = <T,>({ selectedValue, setSelectedValue, handleChangeRowsDisplay, options = [] }: DropdownProps<T>) => {
  const [isExpand, setIsExpand] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current?.contains(event.target as Node)) return;
      setIsExpand(false);
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <button
        className="w-fit"
        onClick={() => {
          setIsExpand((prev) => !prev);
        }}
        type="button">
        <div className={styles.selectedValueDisplay}>
          <span className={styles.selectedValueDisplayText}>{selectedValue?.toString()}</span>
          <span>
            <DropdownArrow direction={isExpand ? "up" : "down"} />
          </span>
        </div>
        {isExpand && (
          <div className="absolute w-[80px]">
            {options.map((item) => (
              <button
                key={item.key}
                className={styles.dropdownItem}
                style={{ backgroundColor: selectedValue === item.key ? "#F1EBF4" : "white" }}
                onClick={() => {
                  setSelectedValue?.(item.value);
                  handleChangeRowsDisplay?.(item.value);
                }}>
                {item.value?.toString()}
              </button>
            ))}
          </div>
        )}
      </button>
    </div>
  );
};

export default Dropdown;
