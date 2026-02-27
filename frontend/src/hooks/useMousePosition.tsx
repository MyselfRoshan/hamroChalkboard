import React from "react"

export type MousePositionOptions = {
    touch?: boolean
    initialPosition?: MousePosition
}

export type MousePosition = {
    x: number
    y: number
}
const useMousePosition = ({
    touch = true,
    initialPosition = { x: 0, y: 0 },
}: MousePositionOptions = {}): MousePosition => {
    const [mousePosition, setMousePosition] = React.useState({
        x: initialPosition.x,
        y: initialPosition.y,
    })

    React.useEffect(() => {
        const mousePositionHandler = (event: MouseEvent | TouchEvent) => {
            let x, y
            if (event instanceof MouseEvent) {
                ;[x, y] = [event.clientX, event.clientY]
            } else {
                ;[x, y] = [event.touches[0].clientX, event.touches[0].clientY]
            }

            setMousePosition({ x, y })
        }

        window.addEventListener("mousemove", mousePositionHandler)

        if (touch) {
            window.addEventListener("touchmove", mousePositionHandler, {
                passive: true,
            })
        }

        return () => {
            window.removeEventListener("mousemove", mousePositionHandler)

            if (touch) {
                window.removeEventListener("touchmove", mousePositionHandler)
            }
        }
    }, [touch])

    return mousePosition
}

export default useMousePosition
