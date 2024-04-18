import React from "react";

export default function PersonIcon({ className }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <g clipPath="url(#clip0_380_12291)">
        <path
          d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 19.2857C8.68629 19.2857 6 17.2041 6 14.0816C6 12.932 6.93198 12 8.08163 12H15.9184C17.068 12 18 12.932 18 14.0816C18 17.2041 15.3137 19.2857 12 19.2857ZM12 10.7143C10.2248 10.7143 8.78571 9.2752 8.78571 7.5C8.78571 5.7248 10.2248 4.28571 12 4.28571C13.7752 4.28571 15.2143 5.7248 15.2143 7.5C15.2143 9.2752 13.7752 10.7143 12 10.7143Z"
          fill="#616161"
        />
      </g>
      <defs>
        <clipPath id="clip0_380_12291">
          <rect
            width="24"
            height="24"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
