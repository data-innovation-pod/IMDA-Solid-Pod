"use client";

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import Chevron from "~/app/_assets/svg/chevron";

import styles from "./home-styles.module.css";
import { mergeClassnames } from "~/app/_utils";

export type Option = {
  label: string;
  value: string;
};

interface SelectProps<T> {
  setSelectedOption: Dispatch<SetStateAction<T>>;
  options: T[];
  selectedOption?: T;
}

export default function Select<T extends Option>({ selectedOption, setSelectedOption, options }: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function createHandleClick(option: T) {
    return () => {
      setSelectedOption(option);
      setIsOpen(false);
    };
  }

  useEffect(() => {
    const handler = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={styles.selectInputContainer}>
      <button
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.selectInputButton}>
        <span className={styles.selectInputContent}>{selectedOption?.label}</span>
        <div className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <Chevron direction="down" />
        </div>
      </button>
      <ul className={mergeClassnames(styles.selecInputDropdown, isOpen ? "block" : "hidden")}>
        {options.map((option) => (
          <li key={option.value}>
            <button
              onClick={createHandleClick(option)}
              className={styles.selectInputDropdownItem}>
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
