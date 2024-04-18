interface SortArrowIconProps {
  sort: "asc" | "desc";
}

export default function SortArrowIcon({ sort = "asc" }: SortArrowIconProps) {
  return (
    <svg
      width="7"
      height="12"
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${sort === "asc" ? 0 : 180}deg)` }}>
      <path
        d="M6.51367 2.92383L5.98633 3.45117L4.00586 1.47656L4 12H3.25L3.25586 1.45898L1.26367 3.45117L0.736328 2.92383L3.625 0.0351562L6.51367 2.92383Z"
        fill="#605E5C"
      />
    </svg>
  );
}
