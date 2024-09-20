import * as React from "react"
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react"
import { Point } from "src/components/Canvas"

type CanvasProps = {
    // canvasRef: React.RefObject<HTMLCanvasElement>
    width: number
    height: number
}

//   type Point = {
//     x: number;
//     y: number;
//   };

const ORIGIN: Point = [0, 0]

// adjust to device to avoid blur
const { devicePixelRatio: ratio = 1 } = window

function diffPoints(p1: Point, p2: Point): Point {
    return [p1[0] - p2[0], p1[1] - p2[1]]
}

function addPoints(p1: Point, p2: Point): Point {
    return [p1[0] + p2[0], p1[1] + p2[1]]
}

function scalePoint(p1: Point, scale: number): Point {
    return [p1[0] / scale, p1[1] / scale]
}

const ZOOM_SENSITIVITY = 500 // bigger for lower zoom per scroll

export default function CanvasT({ ...props }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null,
    )
    const [scale, setScale] = useState<number>(1)
    const [offset, setOffset] = useState<Point>(ORIGIN)
    const [mousePos, setMousePos] = useState<Point>(ORIGIN)
    const [viewportTopLeft, setViewportTopLeft] = useState<Point>(ORIGIN)
    const isResetRef = useRef<boolean>(false)
    const lastMousePosRef = useRef<Point>(ORIGIN)
    const lastOffsetRef = useRef<Point>(ORIGIN)

    // update last offset
    useEffect(() => {
        lastOffsetRef.current = offset
    }, [offset])

    // reset
    const reset = useCallback(
        (context: CanvasRenderingContext2D) => {
            if (context && !isResetRef.current) {
                // adjust for device pixel density
                context.canvas.width = props.width * ratio
                context.canvas.height = props.height * ratio
                context.scale(ratio, ratio)
                setScale(1)

                // reset state and refs
                setContext(context)
                setOffset(ORIGIN)
                setMousePos(ORIGIN)
                setViewportTopLeft(ORIGIN)
                lastOffsetRef.current = ORIGIN
                lastMousePosRef.current = ORIGIN

                // this thing is so multiple resets in a row don't clear canvas
                isResetRef.current = true
            }
        },
        [props.width, props.height],
    )

    // functions for panning
    const mouseMove = useCallback(
        (event: MouseEvent) => {
            if (context) {
                const lastMousePos = lastMousePosRef.current
                const currentMousePos: Point = [event.pageX, event.pageY] // use document so can pan off element
                lastMousePosRef.current = currentMousePos

                const mouseDiff = diffPoints(currentMousePos, lastMousePos)
                setOffset(
                    (prevOffset: Point) =>
                        addPoints(prevOffset, mouseDiff) as Point,
                )
            }
        },
        [context],
    )

    const mouseUp = useCallback(() => {
        document.removeEventListener("mousemove", mouseMove)
        document.removeEventListener("mouseup", mouseUp)
    }, [mouseMove])

    const startPan = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
            document.addEventListener("mousemove", mouseMove)
            document.addEventListener("mouseup", mouseUp)
            lastMousePosRef.current = [event.pageX, event.pageY]
        },
        [mouseMove, mouseUp],
    )

    // setup canvas and set context
    useLayoutEffect(() => {
        if (canvasRef.current) {
            // get new drawing context
            const renderCtx = canvasRef.current.getContext("2d")

            if (renderCtx) {
                reset(renderCtx)
            }
        }
    }, [reset, props.height, props.width])

    // pan when offset or scale changes
    useLayoutEffect(() => {
        if (context && lastOffsetRef.current) {
            const offsetDiff = scalePoint(
                diffPoints(offset, lastOffsetRef.current),
                scale,
            )
            context.translate(offsetDiff[0], offsetDiff[1])
            setViewportTopLeft(prevVal => diffPoints(prevVal, offsetDiff))
            isResetRef.current = false
        }
    }, [context, offset, scale])

    // draw
    useLayoutEffect(() => {
        if (context) {
            const squareSize = 20

            // clear canvas but maintain transform
            const storedTransform = context.getTransform()
            context.canvas.width = context.canvas.width
            context.setTransform(storedTransform)

            context.fillRect(
                props.width / 2 - squareSize / 2,
                props.height / 2 - squareSize / 2,
                squareSize,
                squareSize,
            )
            context.arc(
                viewportTopLeft[0],
                viewportTopLeft[1],
                5,
                0,
                2 * Math.PI,
            )
            context.fillStyle = "red"
            context.fill()
        }
    }, [props.width, props.height, context, scale, offset, viewportTopLeft])

    // add event listener on canvas for mouse position
    useEffect(() => {
        const canvasElem = canvasRef.current
        if (canvasElem === null) {
            return
        }

        function handleUpdateMouse(event: MouseEvent) {
            event.preventDefault()
            if (canvasRef.current) {
                const viewportMousePos: Point = [event.clientX, event.clientY]
                const topLeftCanvasPos: Point = [
                    canvasRef.current.offsetLeft,
                    canvasRef.current.offsetTop,
                ]
                setMousePos(diffPoints(viewportMousePos, topLeftCanvasPos))
            }
        }

        canvasElem.addEventListener("mousemove", handleUpdateMouse)
        canvasElem.addEventListener("wheel", handleUpdateMouse)
        return () => {
            canvasElem.removeEventListener("mousemove", handleUpdateMouse)
            canvasElem.removeEventListener("wheel", handleUpdateMouse)
        }
    }, [])

    // add event listener on canvas for zoom
    useEffect(() => {
        const canvasElem = canvasRef.current
        if (canvasElem === null) {
            return
        }

        // this is tricky. Update the viewport's "origin" such that
        // the mouse doesn't move during scale - the 'zoom point' of the mouse
        // before and after zoom is relatively the same position on the viewport
        function handleWheel(event: WheelEvent) {
            event.preventDefault()
            if (context) {
                const zoom = 1 - event.deltaY / ZOOM_SENSITIVITY
                const viewportTopLeftDelta: Point = [
                    (mousePos[0] / scale) * (1 - 1 / zoom),
                    (mousePos[1] / scale) * (1 - 1 / zoom),
                ]
                const newViewportTopLeft = addPoints(
                    viewportTopLeft,
                    viewportTopLeftDelta,
                )

                context.translate(viewportTopLeft[0], viewportTopLeft[1])
                context.scale(zoom, zoom)
                context.translate(
                    -newViewportTopLeft[0],
                    -newViewportTopLeft[1],
                )

                setViewportTopLeft(newViewportTopLeft)
                setScale(scale * zoom)
                isResetRef.current = false
            }
        }

        canvasElem.addEventListener("wheel", handleWheel)
        return () => canvasElem.removeEventListener("wheel", handleWheel)
    }, [context, mousePos[0], mousePos[1], viewportTopLeft, scale])

    return (
        <div>
            <button onClick={() => context && reset(context)}>Reset</button>
            <pre>scale: {scale}</pre>
            <pre>offset: {JSON.stringify(offset)}</pre>
            <pre>viewportTopLeft: {JSON.stringify(viewportTopLeft)}</pre>
            <canvas
                onMouseDown={startPan}
                ref={canvasRef}
                width={props.width * ratio}
                height={props.height * ratio}
                style={{
                    border: "2px solid #000",
                    width: `${props.width}px`,
                    height: `${props.height}px`,
                }}
            ></canvas>
        </div>
    )
}
