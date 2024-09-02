// CircleCursor.js
import { useEffect } from "react";
import { useWindowSize } from "src/hooks/useWindowSize";
type CustomCursorProps = {
  size?: number;
};
export const CustomCursor = ({ size }: CustomCursorProps) => {
  const { width, height } = useWindowSize();
  useEffect(() => {
    const onPointerMove = (event: MouseEvent): void => {
      const cursor = document.getElementById("custom-cursor");
      if (cursor) {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
      }
    };
    document.addEventListener("pointerup", onPointerMove);
    document.addEventListener("pointermove", onPointerMove);

    return () => {
      document.removeEventListener("pointerup", onPointerMove);
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, [size]);
  return (
    <div
      id="custom-cursor"
      className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff0000] mix-blend-difference"
      style={{
        width: `${size! + 1}px`,
        height: `${size! + 1}px`,
        // background: "rgba(255, 0, 0)",
        // mixBlendMode: "difference",
      }}
    ></div>
  );
};
