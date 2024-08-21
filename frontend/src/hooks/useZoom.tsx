// import {
//     useEffect,
//     useCallback,
//     useLayoutEffect,
//     useRef,
//     useState,
// } from "react"
// import { Point } from "types/canvas"

// const ORIGIN = Object.freeze({ x: 0, y: 0 })
// const ZOOM_SENSITIVITY = 500 // bigger for lower zoom per scroll
// const { devicePixelRatio: ratio = 1 } = window

// function diffPoints(p1: Point, p2: Point): Point {
//     return { x: p1.x - p2.x, y: p1.y - p2.y }
// }

// function addPoints(p1: Point, p2: Point): Point {
//     return { x: p1.x + p2.x, y: p1.y + p2.y }
// }

// function scalePoint(p1: Point, scale: number): Point {
//     return { x: p1.x / scale, y: p1.y / scale }
// }

// export function useZoom(
//     canvasRef: React.RefObject<HTMLCanvasElement>,
//     ctxRef: React.RefObject<CanvasRenderingContext2D>,
//     canvasWidth: number,
//     canvasHeight: number,
// ) {
//     const [scale, setScale] = useState<number>(1)
//     const [offset, setOffset] = useState<Point>(ORIGIN)
//     const [mousePos, setMousePos] = useState<Point>(ORIGIN)
//     const [viewportTopLeft, setViewportTopLeft] = useState<Point>(ORIGIN)
//     const isResetRef = useRef<boolean>(false)
//     const lastMousePosRef = useRef<Point>(ORIGIN)
//     const lastOffsetRef = useRef<Point>(ORIGIN)

//     const reset = useCallback(
//         (context: CanvasRenderingContext2D) => {
//             if (context && !isResetRef.current) {
//                 context.canvas.width = canvasWidth * ratio
//                 context.canvas.height = canvasHeight * ratio
//                 context.scale(ratio, ratio)
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

//     const mouseUp = useCallback(() => {
//         document.removeEventListener("mousemove", mouseMove)
//         document.removeEventListener("mouseup", mouseUp)
//     }, [mouseMove])

//     const startPan = useCallback(
//         (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
//             document.addEventListener("mousemove", mouseMove)
//             document.addEventListener("mouseup", mouseUp)
//             lastMousePosRef.current = { x: event.pageX, y: event.pageY }
//         },
//         [mouseMove, mouseUp],
//     )

//     useLayoutEffect(() => {
//         if (canvasRef.current) {
//             const renderCtx = canvasRef.current.getContext("2d")
//             if (renderCtx) {
//                 reset(renderCtx)
//             }
//         }
//     }, [reset, canvasHeight, canvasWidth])

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

//     useLayoutEffect(() => {
//         if (ctxRef.current) {
//             const squareSize = 20

//             const storedTransform = ctxRef.current.getTransform()
//             ctxRef.current.setTransform(storedTransform)

//             ctxRef.current.fillRect(
//                 canvasWidth / 2 - squareSize / 2,
//                 canvasHeight / 2 - squareSize / 2,
//                 squareSize,
//                 squareSize,
//             )
//             ctxRef.current.arc(
//                 viewportTopLeft.x,
//                 viewportTopLeft.y,
//                 5,
//                 0,
//                 2 * Math.PI,
//             )
//             ctxRef.current.fillStyle = "red"
//             ctxRef.current.fill()
//         }
//     }, [canvasWidth, canvasHeight, ctxRef, scale, offset, viewportTopLeft])

//     useEffect(() => {
//         const canvasElem = canvasRef.current
//         if (canvasElem) {
//             function handleUpdateMouse(event: MouseEvent) {
//                 event.preventDefault()
//                 if (canvasRef.current) {
//                     const viewportMousePos = {
//                         x: event.clientX,
//                         y: event.clientY,
//                     }
//                     const topLeftCanvasPos = {
//                         x: canvasRef.current.offsetLeft,
//                         y: canvasRef.current.offsetTop,
//                     }
//                     setMousePos(diffPoints(viewportMousePos, topLeftCanvasPos))
//                 }
//             }

//             canvasElem.addEventListener("mousemove", handleUpdateMouse)
//             canvasElem.addEventListener("wheel", handleUpdateMouse)
//             return () => {
//                 canvasElem.removeEventListener("mousemove", handleUpdateMouse)
//                 canvasElem.removeEventListener("wheel", handleUpdateMouse)
//             }
//         }
//     }, [])

//     useEffect(() => {
//         const canvasElem = canvasRef.current
//         if (canvasElem) {
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

//             canvasElem.addEventListener("wheel", handleWheel)
//             return () => canvasElem.removeEventListener("wheel", handleWheel)
//         }
//     }, [ctxRef, mousePos.x, mousePos.y, viewportTopLeft, scale])

//     return {
//         startPan,
//         reset: () => ctxRef && ctxRef.current && reset(ctxRef.current),
//         scale,
//         offset,
//         ratio,
//         viewportTopLeft,
//     }
// }

/* new */
import {
    useEffect,
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
} from "react"
import { Point } from "types/canvas"

const ORIGIN = Object.freeze({ x: 0, y: 0 })
const ZOOM_SENSITIVITY = 1000 // Adjust for more reliable zooming
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
                    setScale(scale * zoom)
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
    }
}
