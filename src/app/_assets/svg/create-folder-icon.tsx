import React from "react";

export default function CreateFolderIcon({ className }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M4 6.5V8H7.58579C7.71839 8 7.84557 7.94732 7.93934 7.85355L9.29289 6.5L7.93934 5.14645C7.84557 5.05268 7.71839 5 7.58579 5H5.5C4.67157 5 4 5.67157 4 6.5ZM3 6.5C3 5.11929 4.11929 4 5.5 4H7.58579C7.98361 4 8.36514 4.15804 8.64645 4.43934L10.2071 6H14.5C15.8807 6 17 7.11929 17 8.5V9.25716C16.6929 9.00353 16.3578 8.78261 16 8.59971V8.5C16 7.67157 15.3284 7 14.5 7H10.2071L8.64645 8.56066C8.36514 8.84197 7.98361 9 7.58579 9H4V13.5C4 14.3284 4.67157 15 5.5 15H8.20703C8.30564 15.3486 8.43777 15.6832 8.59971 16H5.5C4.11929 16 3 14.8807 3 13.5V6.5ZM18 13.5C18 15.9853 15.9853 18 13.5 18C11.0147 18 9 15.9853 9 13.5C9 11.0147 11.0147 9 13.5 9C15.9853 9 18 11.0147 18 13.5ZM14 11.5C14 11.2239 13.7761 11 13.5 11C13.2239 11 13 11.2239 13 11.5V13H11.5C11.2239 13 11 13.2239 11 13.5C11 13.7761 11.2239 14 11.5 14H13V15.5C13 15.7761 13.2239 16 13.5 16C13.7761 16 14 15.7761 14 15.5V14H15.5C15.7761 14 16 13.7761 16 13.5C16 13.2239 15.7761 13 15.5 13H14V11.5Z"
        fill="#424242"
      />
    </svg>
  );
}