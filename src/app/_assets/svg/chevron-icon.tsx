import { type CustomSVGProps } from "~/types/JsxComponents";

export default function ChevronIcon({ fillColor = "#424242", fillOpacity = 1, className }: CustomSVGProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M18.7002 24L10.6669 15.9667L18.7002 7.93333L20.1336 9.36667L13.5336 15.9667L20.1336 22.5667L18.7002 24Z"
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
    </svg>
  );
}
