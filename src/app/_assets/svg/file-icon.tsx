import React from "react";

export default function FileIcon({ className }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="36"
      height="42"
      viewBox="0 0 36 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}>
      <rect
        x="8"
        y="11"
        width="20"
        height="20"
        fill="url(#pattern0)"
        fillOpacity="0.5"
      />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1">
          <use
            xlinkHref="#image0_52_33862"
            transform="scale(0.0208333)"
          />
        </pattern>
        <image
          id="image0_52_33862"
          width="48"
          height="48"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABNUlEQVR4nO2ZwUrDQBBAnwWDfrDoKdiD3vXgrf6MfoX2L3IohcDIQg6LlNrNzGa2dR7MJbCZfZlmskwhCIJTuAXWwBYYASmMPfACrHDa/OeMTR+KjYfE2mjzbhLbLPkdcF243l1izBJ3M9a7V0Ky0K7feEiIocAV8Pbr2nttCUsBPCTEWGBxCakgsKiEVBJILCKhFfirDa9qdyetQP4hvPeQEKXAo+LY8dqCgOYwuG9BIHED9MD3jOO4GtObeeSUEChHogL/6Sf0DOxmtMi05slbIJ1lBsWHavAWYHqKZ1uBWkgIZEQFLqWN7o68tGfTRofWBEraaJMVqIWEQEZUwPuhjcrxeildli/lVnPKXMeKDnjI8n1Z3FQz19FG39qffCXxMY1jTNDMdUpinHL0lpsPgkvmBwG683JJSg4MAAAAAElFTkSuQmCC"
        />
      </defs>
    </svg>
  );
}
