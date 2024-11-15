// CircleCursor.js
import { useEffect } from "react"
type DrawModeCursorProps = {
    size?: number
}
export const DrawModeCursor = ({ size }: DrawModeCursorProps) => {
    useEffect(() => {
        const onPointerMove = (event: MouseEvent): void => {
            const cursor = document.getElementById("custom-cursor")
            if (cursor) {
                cursor.style.translate = `${event.clientX}px ${event.clientY}px`
            }
        }
        document.addEventListener("pointerup", onPointerMove)
        document.addEventListener("pointermove", onPointerMove)

        return () => {
            document.removeEventListener("pointerup", onPointerMove)
            document.removeEventListener("pointermove", onPointerMove)
        }
    }, [size])
    return (
        <span
            id="custom-cursor"
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff0000] mix-blend-difference"
            style={{
                width: `${size! + 1}px`,
                height: `${size! + 1}px`,
            }}
        ></span>
    )
}
