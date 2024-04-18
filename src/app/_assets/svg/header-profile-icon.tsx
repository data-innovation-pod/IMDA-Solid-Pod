import { type CustomSVGProps } from "~/types/JsxComponents";

export default function HeaderProfileIcon({ fillColor = "white", className }: CustomSVGProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0ZM16 25.7143C11.5817 25.7143 8 22.9388 8 18.7755C8 17.2426 9.24264 16 10.7755 16H21.2245C22.7574 16 24 17.2426 24 18.7755C24 22.9388 20.4183 25.7143 16 25.7143ZM16 14.2857C13.6331 14.2857 11.7143 12.3669 11.7143 10C11.7143 7.63307 13.6331 5.71429 16 5.71429C18.3669 5.71429 20.2857 7.63307 20.2857 10C20.2857 12.3669 18.3669 14.2857 16 14.2857Z"
        fill={fillColor}
      />
    </svg>
  );
}
