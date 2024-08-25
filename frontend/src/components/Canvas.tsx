import { Color } from "@rc-component/color-picker"
import { cn } from "lib/utils"
import { Menu } from "lucide-react"
import React, {
    PointerEvent,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react"
import { toast } from "sonner"
import useHistory from "src/hooks/useHistory"
import { WindowSize } from "src/hooks/useWindowSize"
import { CanvasMode, CanvasSetting } from "types/canvas"
import BurgerMenu from "./BurgerMenu"
import { CustomizationBar } from "./CustomizationBar"
import Notification from "./Notification"
import Toolbar from "./Toolbar"
import ToolButton from "./ToolButton"
let lastPath: Point[] = []

import "./App.css"
type CanvasProps = {
    boardId: string
    settings: React.MutableRefObject<CanvasSetting>
    size: WindowSize
}

export type History = {
    mode: CanvasMode
    path: Point[]
    color: Color
    stroke: number
}
export type Point = [x: number, y: number]
export default function Canvas({ settings, size }: CanvasProps) {
    const PAN_LIMIT = 3000
    const width = Math.min(size.width, PAN_LIMIT)
    const height = Math.min(size.height, PAN_LIMIT)
    const [drawing, setDrawing] = useState<boolean>(false)
    const [, render] = useReducer(prev => !prev, false)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const preview = useRef<HTMLDivElement | null>(null)
    const isDrawing = useRef<boolean>(false)

    const coords = useRef<Point>([0, 0])

    const isMoving = useRef<boolean>(false)
    const importInput = useRef<HTMLInputElement | null>(null)

    // const [scale, setScale] = useState<number>(1)
    // const [scaleOffset, setScaleOffset] = useState<Point>([0, 0])
    // const { startPan, reset, scale, offset, ratio, viewportTopLeft, setZoom } =
    //     useZoom(canvasRef, ctxRef, size.width, size.height)
    // const
    const {
        importHistory,
        pushHistory,
        popHistory,
        redoHistory,
        getHistory,
        getRedoHistory,
    } = useHistory()

    const prevent = (
        e: PointerEvent | Event | React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onPointerDown = (e: PointerEvent) => {
        prevent(e)
        getContext(settings.current)
        coords.current = [e.clientX, e.clientY]
        if (settings.current.mode === CanvasMode.Pan) {
            isMoving.current = true
            return
        }
        setDrawing(true)
        isDrawing.current = true
        const point = getPoint(e, ctxRef.current!)
        lastPath = []
        drawModes(settings.current.mode, ctxRef.current!, point, lastPath)
    }

    const onPointerUp: EventListenerOrEventListenerObject = (e): void => {
        prevent(e)
        if (settings.current.mode === CanvasMode.Pan) {
            isMoving.current = false
            return
        }
        setDrawing(false)
        isDrawing.current = false
        if (lastPath.length > 0) {
            pushHistory({ ...settings.current, path: lastPath })
            lastPath = []
            drawCanvas(getContext())
        }
    }

    const getPreviewActiveStyles = (): React.CSSProperties => {
        const styles: React.CSSProperties = {
            width: `${(width * 100) / PAN_LIMIT}%`,
            height: `${(height * 100) / PAN_LIMIT}%`,
        }
        if (!ctxRef.current) return styles
        const { e, f } = getContext().getTransform()
        styles.left = `${(100 - e * 100) / PAN_LIMIT}%`
        styles.top = `${(100 - f * 100) / PAN_LIMIT}%`
        return styles
    }

    const updatePreview = () => {
        if (preview.current) {
            const style = getPreviewActiveStyles()
            preview.current.style.left = style.left!.toString()
            preview.current.style.top = style.top!.toString()
        }
    }

    const onCanvasMove = (e: PointerEvent, ctx: CanvasRenderingContext2D) => {
        const [x1, y1] = coords.current
        const { clientX: x2, clientY: y2 } = e
        let dx = x2 - x1
        let dy = y2 - y1
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return
        const { e: tdx, f: tdy } = ctx.getTransform()
        const ntdx = Math.min(Math.max(-(PAN_LIMIT - width), tdx + dx), 0)
        const ntdy = Math.min(Math.max(-(PAN_LIMIT - height), tdy + dy), 0)
        ctx.setTransform(1, 0, 0, 1, ntdx, ntdy)
        drawCanvas(ctx)
        coords.current = [x2, y2]
        updatePreview()
    }

    const onPointerMove: EventListenerOrEventListenerObject = e => {
        prevent(e)
        if (isMoving.current) return onCanvasMove(e as any, ctxRef.current!)
        if (!isDrawing.current) return
        // console.log("dragging")
        // if (canvasRef.current && settings.current.mode === CanvasMode.Pan)
        //     (canvasRef.current as HTMLCanvasElement).style.cursor = "grabbing"
        const point = getPoint(e as any, ctxRef.current!)
        drawModes(settings.current.mode, ctxRef.current!, point, lastPath)
    }

    const drawModes = (
        mode: CanvasMode,
        ctx: CanvasRenderingContext2D,
        point: Point | null,
        path: Point[],
    ) => {
        switch (mode) {
            case CanvasMode.Pencil:
                point ? previewPen(point, ctx) : drawPen(path, ctx)
                break
            case CanvasMode.Rect:
                if (point) {
                    path.length === 0 ? (path[0] = point) : (path[1] = point)
                    previewRect(path, ctx)
                } else {
                    drawRect(path, ctx)
                }
                break
            case CanvasMode.Ellipse:
                if (point) {
                    path.length === 0 ? (path[0] = point) : (path[1] = point)
                    previewCircle(path, ctx)
                } else {
                    drawCircle(path, ctx)
                }
                break
            default:
                return
        }
    }

    const getContext = (
        config?: CanvasSetting,
        ctx?: CanvasRenderingContext2D,
    ) => {
        const canvas = canvasRef.current
        if (canvas) {
            ctxRef.current = canvas.getContext("2d")
        }

        if (!ctx) ctx = ctxRef.current!
        if (config) {
            ctx.strokeStyle = config.color.toString()
            ctx.lineWidth = config.stroke
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
        }
        return ctx
    }

    const getPoint = (
        e: PointerEvent,
        ctx: CanvasRenderingContext2D,
    ): Point => {
        const { e: dx, f: dy } = ctx.getTransform()
        const rect = canvasRef.current!.getBoundingClientRect()
        return [e.clientX - rect.x - dx, e.clientY - rect.y - dy]
    }

    const previewRect = (path: Point[], ctx: CanvasRenderingContext2D) => {
        if (path.length < 2) return
        drawCanvas(ctx)
        drawRect(path, getContext(settings.current, ctx))
    }

    const drawRect = (path: Point[], ctx: CanvasRenderingContext2D) => {
        ctx.beginPath()
        ctx.rect(
            path[0][0],
            path[0][1],
            path[1][0] - path[0][0],
            path[1][1] - path[0][1],
        )
        ctx.stroke()
    }

    const previewCircle = (path: Point[], ctx: CanvasRenderingContext2D) => {
        if (path.length < 2) return
        drawCanvas(ctx)
        getContext(settings.current, ctx) // reset context
        drawCircle(path, ctx)
    }

    const getDistance = ([[p1X, p1Y], [p2X, p2Y]]: Point[]) => {
        return Math.sqrt(Math.pow(p1X - p2X, 2) + Math.pow(p1Y - p2Y, 2))
    }

    const drawCircle = (path: Point[], ctx: CanvasRenderingContext2D) => {
        ctx.beginPath()
        ctx.arc(path[0][0], path[0][1], getDistance(path), 0, 2 * Math.PI)
        ctx.stroke()
    }

    const previewPen = (point: Point, ctx: CanvasRenderingContext2D) => {
        console.log(isDrawing.current, drawing, isMoving.current)
        if (lastPath.length === 0) {
            ctx.beginPath()
            ctx.moveTo(point[0], point[1])
            // console.log("before: ", point[0], point[1])
        }
        ctx.lineTo(point[0], point[1])
        ctx.stroke()
        lastPath.push(point)
        // console.log("after: ", point[0], point[1])
    }

    const drawPen = (points: Point[], ctx: CanvasRenderingContext2D) => {
        // ctx.clearRect(0, 0, width, height)
        // bzCurve(ctx, points, 0.3, 1)
        ctx.beginPath()
        for (const p of points) {
            ctx.lineTo(p[0], p[1])
        }
        ctx.stroke()
    }

    const clearCanvas = (ctx: CanvasRenderingContext2D) => {
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, PAN_LIMIT, PAN_LIMIT)
        ctx.restore()
    }

    const drawCanvas = (ctx: CanvasRenderingContext2D) => {
        clearCanvas(ctx)
        for (const item of getHistory()) {
            getContext(item, ctx)
            drawModes(item.mode, ctx, null, item.path)
        }
    }

    const undoCanvas = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        if (getHistory().length === 0) return
        popHistory()
        drawCanvas(getContext())
        render()
    }

    const redoCanvas = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        redoHistory()
        drawCanvas(getContext())
        render()
    }

    const setMode = (mode: CanvasMode) => {
        settings.current.mode = mode
        render()
    }

    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            prevent(e)
            if (e.shiftKey) {
                console.table(e.deltaY)
            }
        }
        document.addEventListener("pointerup", onPointerUp)
        document.addEventListener("pointermove", onPointerMove)
        document.addEventListener("wheel", onWheel)
        getContext().setTransform(
            1,
            0,
            0,
            1,
            -(PAN_LIMIT - width) / 2,
            -(PAN_LIMIT - height) / 2,
        )
        drawCanvas(getContext())
        updatePreview()
        return () => {
            document.removeEventListener("pointerup", onPointerUp)
            document.removeEventListener("pointermove", onPointerMove)
            document.removeEventListener("wheel", onWheel)
        }
    }, [width, height])
    // }, [width, height, scale])

    const changeColor = (color: Color) => {
        settings.current.color = color
    }

    const exportCanvasAsJSON = () => {
        const link = document.createElement("a")
        const content = JSON.stringify(getHistory())
        const file = new Blob([content], { type: "application/json" })
        link.href = URL.createObjectURL(file)
        link.download = `chalkboard_${Date.now()}.json`
        link.click()
        URL.revokeObjectURL(link.href)
        toast.success("Chalkboard Downloaded Successfully")
    }

    const importCanvas = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length === 0) return
        const file = e.target.files![0]
        const reader = new FileReader()
        reader.onload = () => {
            try {
                importHistory(JSON.parse(reader.result as string))
                drawCanvas(getContext())
                render()
                toast.success(`${file.name} Imported Successfully`)
            } catch (err) {
                toast.error("Invalid Chalkboard File")
            }
        }
        reader.readAsText(file)
    }

    const onImportClick = () => {
        importInput.current?.click()
    }

    // const setZoom = (delta: number) => {
    //     setScale(prevState => Math.min(Math.max(prevState + delta, 0.1), 20))
    // }
    return (
        <>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onPointerDown={onPointerDown}
                className={
                    cn(
                        settings.current.mode === CanvasMode.None
                            ? "cursor-default"
                            : "",
                        settings.current.mode === CanvasMode.Pan
                            ? // ? "cursor-grab active:cursor-grabbing"
                              "moving"
                            : "",
                        settings.current.mode === CanvasMode.Pencil ||
                            settings.current.mode === CanvasMode.Rect ||
                            settings.current.mode === CanvasMode.Ellipse
                            ? "cursor-crosshair"
                            : "",
                    )
                    // settings.current.mode === CanvasMode.Pan
                    //     ? "moving"
                    //     : "drawing"
                }
            />

            {/* <div
                onPointerDown={e => e.stopPropagation()}
                onPointerUp={e => e.stopPropagation()}
                aria-disabled={drawing}
            >
                <button
                    className="button"
                    type="button"
                    onClick={exportCanvas}
                    disabled={history.current.length === 0}
                >
                    <Download />
                </button>
                <input
                    ref={importInput}
                    className="hidden"
                    type="file"
                    accept="application/json"
                    onChange={importCanvas}
                />
                <button
                className="button"
                type="button"
                onClick={onImportClick}
                >
                <Import />
                </button>
                </div> */}
            <div
                onPointerDown={e => e.stopPropagation()}
                onPointerUp={e => e.stopPropagation()}
                aria-disabled
            >
                <Toolbar
                    canvasMode={settings.current.mode}
                    setCanvasMode={setMode}
                    canRedo={getRedoHistory().length === 0}
                    canUndo={getHistory().length === 0}
                    undo={undoCanvas}
                    redo={redoCanvas}
                />
            </div>

            {settings.current.mode !== CanvasMode.Pan &&
                settings.current.mode !== CanvasMode.None && (
                    <CustomizationBar
                        settings={settings}
                        // color={settings.current.color}
                        // setColor={changeColor}
                    />
                )}
            <BurgerMenu
                downloadFile={exportCanvasAsJSON}
                openFile={onImportClick}
            >
                <div>
                    <input
                        ref={importInput}
                        className="hidden"
                        type="file"
                        accept="application/json"
                        onChange={importCanvas}
                    />
                    <ToolButton label="menu" icon={Menu} />
                </div>
            </BurgerMenu>
            <div className="absolute top-[50%] translate-y-[50%] right-2 grid gap-y-4">
                <div className="bg-white rounded-md p-1.5 flex justify-center gap-y-1 items-center shadow-md text-center">
                    {/* <div
                        // className=" absolute bottom-20"
                        onPointerDown={e => e.stopPropagation()}
                        onPointerUp={e => e.stopPropagation()}
                        aria-disabled={drawing}
                    >
                        <div className="preview">
                            <div
                                className="active"
                                ref={preview}
                                style={getPreviewActiveStyles()}
                            ></div>
                        </div>
                    </div> */}
                    {/* <ToolButton
                        label="Zoom In"
                        icon={Plus}
                        onClick={() => {
                            setZoom(0.1)
                        }}

                        // isActive={false}
                        // onClick={zoomIn}
                        // isDisabled={!canUndo}
                    />
                    <Hint label="Reset Zoom" side="left" sideOffset={14}>
                        <p
                            className="w-10 h-10 p-1 focus-visible:outline-none text-center"
                            onClick={() => setZoom(1)}
                        >
                            {new Intl.NumberFormat("en-US", {
                                style: "percent",
                            }).format(scale)}
                        </p>
                    </Hint>
                    <ToolButton
                        label="Zoom Out"
                        icon={Minus}
                        isActive={false}
                        onClick={() => {
                            setZoom(-0.1)
                        }}
                        // onClick={() => {}}
                        // onClick={zoomOut}
                        // isDisabled={!canRedo}
                    /> */}
                    {/* <ZoomLevel
                        canvasRef={canvasRef}
                        ctxRef={ctxRef}
                        canvasWidth={width}
                        canvasHeight={height}
                    /> */}
                </div>
            </div>
            <Notification position="top-center" />
        </>
    )
}
