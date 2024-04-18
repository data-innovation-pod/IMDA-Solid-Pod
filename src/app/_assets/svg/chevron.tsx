interface ChevronProps {
  direction?: "up" | "right" | "down" | "left";
}

const getTransformationDegree = (direction: "up" | "right" | "down" | "left") => {
  switch (direction) {
    case "left":
      return 0;
    case "up":
      return 90;
    case "right":
      return 180;
    case "down":
      return 270;
    default:
      return 0;
  }
};
export default function Chevron({ direction = "left" }: ChevronProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${getTransformationDegree(direction)}deg)` }}>
      <path
        d="M18.7002 24L10.6669 15.9667L18.7002 7.93333L20.1336 9.36667L13.5336 15.9667L20.1336 22.5667L18.7002 24Z"
        fill="black"
        fillOpacity="0.38"
      />
    </svg>
  );
}
