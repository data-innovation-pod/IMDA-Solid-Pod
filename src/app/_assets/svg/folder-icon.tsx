import React from "react";

export default function FolderIcon({ className }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M16.2 1.75H8.1L6.3 0H1.8C0.81 0 0 0.7875 0 1.75V5.25H18V3.5C18 2.5375 17.19 1.75 16.2 1.75Z"
        fill="#FFA000"
      />
      <path
        d="M16.2 1.75H1.8C0.81 1.75 0 2.5375 0 3.5V12.25C0 13.2125 0.81 14 1.8 14H16.2C17.19 14 18 13.2125 18 12.25V3.5C18 2.5375 17.19 1.75 16.2 1.75Z"
        fill="#FFCA28"
      />
    </svg>
  );
}
