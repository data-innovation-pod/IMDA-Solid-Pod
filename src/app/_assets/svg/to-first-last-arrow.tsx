interface ToFirstLastArrowProps {
  direction?: "left" | "right";
}

export default function ToFirstLastArrow({ direction = "left" }: ToFirstLastArrowProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${direction === "left" ? 0 : 180}deg)` }}>
      <path
        d="M8.00024 24V8H10.0002V24H8.00024ZM22.9002 23.9L15.1002 16.1L22.9002 8.3L24.3336 9.73333L17.9669 16.1L24.3336 22.4667L22.9002 23.9Z"
        fill="black"
        fillOpacity="0.38"
      />
    </svg>
  );
}
