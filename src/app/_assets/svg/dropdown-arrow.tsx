interface DropdownArrowProps {
  direction?: "up" | "down";
}

const getTransformationDegree = (direction: "up" | "down") => {
  switch (direction) {
    case "down":
      return 0;
    case "up":
      return 180;
    default:
      return 0;
  }
};

export default function DropdownArrow({ direction = "down" }: DropdownArrowProps) {
  return (
    <svg
      style={{ transform: `rotate(${getTransformationDegree(direction)}deg)` }}
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 10.5L12.5 15.5L17.5 10.5H7.5Z"
        fill="black"
        fillOpacity="0.6"
      />
    </svg>
  );
}
