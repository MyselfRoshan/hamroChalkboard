// // This hook manages the zooming functionality for a canvas element.

// import {
//     useEffect,
//     useCallback,
//     useLayoutEffect,
//     useRef,
//     useState,
// } from "react"
// import { Point } from "types/canvas"

// // The constant ORIGIN is an immutable point object with coordinates (0, 0).
// const ORIGIN = Object.freeze({ x: 0, y: 0 })

// // The constant ZOOM_SENSITIVITY determines the zoom level per wheel event.
// const ZOOM_SENSITIVITY = 1000 // Adjust for more reliable zooming

// // The constant ratio is the device pixel ratio of the window.
// const { devicePixelRatio: ratio = 1 } = window

// // The function diffPoints calculates the difference between two points.
// function diffPoints(p1: Point, p2: Point): Point {
//     return { x: p1.x - p2.x, y: p1.y - p2.y }
// }

// // The function addPoints adds two points together.
// function addPoints(p1: Point, p2: Point): Point {
//     return { x: p1.x + p2.x, y: p1.y + p2.y }
// }

// // The function scalePoint scales a point by a given scale factor.
// function scalePoint(p1: Point, scale: number): Point {
//     return { x: p1.x / scale, y: p1.y / scale }
// }

// // The useZoom hook manages the zooming functionality for a canvas element.
// export function useZoom(
//     canvasRef: React.RefObject<HTMLCanvasElement>,
//     ctxRef: React.RefObject<CanvasRenderingContext2D>,
//     canvasWidth: number,
//     canvasHeight: number,
// ) {
//     // The state variables for the zoom level, offset, mouse position, and viewport top left.
//     const [scale, setScale] = useState<number>(1)
//     const [offset, setOffset] = useState<Point>(ORIGIN)
//     const [mousePos, setMousePos] = useState<Point>(ORIGIN)
//     const [viewportTopLeft, setViewportTopLeft] = useState<Point>(ORIGIN)

//     // The reference variables for tracking the last mouse position and offset.
//     const isResetRef = useRef<boolean>(false)
//     const lastMousePosRef = useRef<Point>(ORIGIN)
//     const lastOffsetRef = useRef<Point>(ORIGIN)

//     // The function reset resets the canvas and state variables.
//     const reset = useCallback(
//         (context: CanvasRenderingContext2D) => {
//             if (context && !isResetRef.current) {
//                 // Resize the canvas to the appropriate size and scale.
//                 context.canvas.width = canvasWidth * ratio
//                 context.canvas.height = canvasHeight * ratio
//                 context.scale(ratio, ratio)
//                 // Reset the zoom level, offset, mouse position, and viewport top left.
//                 setScale(1)
//                 setOffset(ORIGIN)
//                 setMousePos(ORIGIN)
//                 setViewportTopLeft(ORIGIN)
//                 lastOffsetRef.current = ORIGIN
//                 lastMousePosRef.current = ORIGIN
//                 isResetRef.current = true
//             }
//         },
//         [canvasWidth, canvasHeight],
//     )

//     // The function mouseMove updates the offset based on the mouse movement.
//     const mouseMove = useCallback(
//         (event: MouseEvent) => {
//             if (ctxRef && ctxRef.current) {
//                 const lastMousePos = lastMousePosRef.current
//                 const currentMousePos = { x: event.pageX, y: event.pageY }
//                 lastMousePosRef.current = currentMousePos

//                 const mouseDiff = diffPoints(currentMousePos, lastMousePos)
//                 setOffset(prevOffset => addPoints(prevOffset, mouseDiff))
//             }
//         },
//         [ctxRef],
//     )

//     // The function mouseUp removes the event listeners for mouse movement and mouse up.
//     const mouseUp = useCallback(() => {
//         document.removeEventListener("mousemove", mouseMove)
//         document.removeEventListener("mouseup", mouseUp)
//     }, [mouseMove])

//     // The function startPan adds event listeners for mouse movement and mouse up.
//     const startPan = useCallback(
//         (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
//             document.addEventListener("mousemove", mouseMove)
//             document.addEventListener("mouseup", mouseUp)
//             lastMousePosRef.current = { x: event.pageX, y: event.pageY }
//         },
//         [mouseMove, mouseUp],
//     )

//     // The useLayoutEffect hook resets the canvas and state variables when the dependencies change.
//     useLayoutEffect(() => {
//         if (canvasRef.current) {
//             const renderCtx = canvasRef.current.getContext("2d")
//             if (renderCtx) {
//                 reset(renderCtx)
//             }
//         }
//     }, [reset, canvasHeight, canvasWidth])

//     // The useLayoutEffect hook updates the translation and viewport top left based on the offset and scale.
//     useLayoutEffect(() => {
//         if (ctxRef.current && lastOffsetRef.current) {
//             const offsetDiff = scalePoint(
//                 diffPoints(offset, lastOffsetRef.current),
//                 scale,
//             )
//             ctxRef.current.translate(offsetDiff.x, offsetDiff.y)
//             setViewportTopLeft(prevVal => diffPoints(prevVal, offsetDiff))
//             isResetRef.current = false
//         }
//     }, [ctxRef, offset, scale])

//     // The useEffect hook adds and removes the wheel event listener for zooming.
//     useEffect(() => {
//         const canvasElem = canvasRef.current
//         if (canvasElem) {
//             // The function handleWheel updates the zoom level and viewport top left based on the mouse wheel event.
//             function handleWheel(event: WheelEvent) {
//                 event.preventDefault()
//                 if (ctxRef.current) {
//                     const zoom = 1 - event.deltaY / ZOOM_SENSITIVITY
//                     const viewportTopLeftDelta = {
//                         x: (mousePos.x / scale) * (1 - 1 / zoom),
//                         y: (mousePos.y / scale) * (1 - 1 / zoom),
//                     }
//                     const newViewportTopLeft = addPoints(
//                         viewportTopLeft,
//                         viewportTopLeftDelta,
//                     )

//                     ctxRef.current.translate(
//                         viewportTopLeft.x,
//                         viewportTopLeft.y,
//                     )
//                     ctxRef.current.scale(zoom, zoom)
//                     ctxRef.current.translate(
//                         -newViewportTopLeft.x,
//                         -newViewportTopLeft.y,
//                     )

//                     setViewportTopLeft(newViewportTopLeft)
//                     setScale(scale * zoom)
//                     isResetRef.current = false
//                 }
//             }

//             // Add the wheel event listener.
//             canvasElem.addEventListener("wheel", handleWheel)
//             return () => canvasElem.removeEventListener("wheel", handleWheel)
//         }
//     }, [ctxRef, mousePos.x, mousePos.y, viewportTopLeft, scale])

//     // Return the necessary functions and state variables for zooming.
//     return {
//         startPan,
//         reset: () => ctxRef && ctxRef.current && reset(ctxRef.current),
//         scale,
//         offset,
//         ratio,
//         viewportTopLeft,
//     }
// }

import {
    useEffect,
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
} from "react"
import { Point } from "types/canvas"

const ORIGIN = Object.freeze({ x: 0, y: 0 })
const ZOOM_SENSITIVITY = 1000
const { devicePixelRatio: ratio = 1 } = window

function diffPoints(p1: Point, p2: Point): Point {
    return { x: p1.x - p2.x, y: p1.y - p2.y }
}

function addPoints(p1: Point, p2: Point): Point {
    return { x: p1.x + p2.x, y: p1.y + p2.y }
}

function scalePoint(p1: Point, scale: number): Point {
    return { x: p1.x / scale, y: p1.y / scale }
}

export function useZoom(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    ctxRef: React.RefObject<CanvasRenderingContext2D>,
    canvasWidth: number,
    canvasHeight: number,
) {
    const [scale, setScale] = useState<number>(1)
    const [offset, setOffset] = useState<Point>(ORIGIN)
    const [mousePos, setMousePos] = useState<Point>(ORIGIN)
    const [viewportTopLeft, setViewportTopLeft] = useState<Point>(ORIGIN)

    const isResetRef = useRef<boolean>(false)
    const lastMousePosRef = useRef<Point>(ORIGIN)
    const lastOffsetRef = useRef<Point>(ORIGIN)

    const reset = useCallback(
        (context: CanvasRenderingContext2D) => {
            if (context && !isResetRef.current) {
                context.canvas.width = canvasWidth * ratio
                context.canvas.height = canvasHeight * ratio
                context.scale(ratio, ratio)
                setScale(1)
                setOffset(ORIGIN)
                setMousePos(ORIGIN)
                setViewportTopLeft(ORIGIN)
                lastOffsetRef.current = ORIGIN
                lastMousePosRef.current = ORIGIN
                isResetRef.current = true
            }
        },
        [canvasWidth, canvasHeight],
    )

    const mouseMove = useCallback(
        (event: MouseEvent) => {
            if (ctxRef && ctxRef.current) {
                const lastMousePos = lastMousePosRef.current
                const currentMousePos = { x: event.pageX, y: event.pageY }
                lastMousePosRef.current = currentMousePos

                const mouseDiff = diffPoints(currentMousePos, lastMousePos)
                setOffset(prevOffset => addPoints(prevOffset, mouseDiff))
            }
        },
        [ctxRef],
    )

    const mouseUp = useCallback(() => {
        document.removeEventListener("mousemove", mouseMove)
        document.removeEventListener("mouseup", mouseUp)
    }, [mouseMove])

    const startPan = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
            document.addEventListener("mousemove", mouseMove)
            document.addEventListener("mouseup", mouseUp)
            lastMousePosRef.current = { x: event.pageX, y: event.pageY }
        },
        [mouseMove, mouseUp],
    )

    const setZoom = useCallback(
        (delta: number) => {
            if (ctxRef.current) {
                const zoom = 1 + delta
                const viewportTopLeftDelta = {
                    x: (mousePos.x / scale) * (1 - 1 / zoom),
                    y: (mousePos.y / scale) * (1 - 1 / zoom),
                }
                const newViewportTopLeft = addPoints(
                    viewportTopLeft,
                    viewportTopLeftDelta,
                )

                ctxRef.current.translate(viewportTopLeft.x, viewportTopLeft.y)
                ctxRef.current.scale(zoom, zoom)
                ctxRef.current.translate(
                    -newViewportTopLeft.x,
                    -newViewportTopLeft.y,
                )

                setViewportTopLeft(newViewportTopLeft)
                setScale(prevScale => prevScale * zoom)
                isResetRef.current = false
            }
        },
        [ctxRef, mousePos.x, mousePos.y, viewportTopLeft, scale],
    )

    useLayoutEffect(() => {
        if (canvasRef.current) {
            const renderCtx = canvasRef.current.getContext("2d")
            if (renderCtx) {
                reset(renderCtx)
            }
        }
    }, [reset, canvasHeight, canvasWidth])

    useLayoutEffect(() => {
        if (ctxRef.current && lastOffsetRef.current) {
            const offsetDiff = scalePoint(
                diffPoints(offset, lastOffsetRef.current),
                scale,
            )
            ctxRef.current.translate(offsetDiff.x, offsetDiff.y)
            setViewportTopLeft(prevVal => diffPoints(prevVal, offsetDiff))
            isResetRef.current = false
        }
    }, [ctxRef, offset, scale])

    useEffect(() => {
        const canvasElem = canvasRef.current
        if (canvasElem) {
            function handleWheel(event: WheelEvent) {
                event.preventDefault()
                if (ctxRef.current) {
                    const zoom = 1 - event.deltaY / ZOOM_SENSITIVITY
                    const viewportTopLeftDelta = {
                        x: (mousePos.x / scale) * (1 - 1 / zoom),
                        y: (mousePos.y / scale) * (1 - 1 / zoom),
                    }
                    const newViewportTopLeft = addPoints(
                        viewportTopLeft,
                        viewportTopLeftDelta,
                    )

                    ctxRef.current.translate(
                        viewportTopLeft.x,
                        viewportTopLeft.y,
                    )
                    ctxRef.current.scale(zoom, zoom)
                    ctxRef.current.translate(
                        -newViewportTopLeft.x,
                        -newViewportTopLeft.y,
                    )

                    setViewportTopLeft(newViewportTopLeft)
                    setScale(prevScale => prevScale * zoom)
                    isResetRef.current = false
                }
            }

            canvasElem.addEventListener("wheel", handleWheel)
            return () => canvasElem.removeEventListener("wheel", handleWheel)
        }
    }, [ctxRef, mousePos.x, mousePos.y, viewportTopLeft, scale])

    return {
        startPan,
        reset: () => ctxRef && ctxRef.current && reset(ctxRef.current),
        scale,
        offset,
        ratio,
        viewportTopLeft,
        setZoom,
    }
}
