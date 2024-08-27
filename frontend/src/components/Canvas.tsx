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
import { useHistoryContext } from "src/hooks/useHistory"
import { WindowSize } from "src/hooks/useWindowSize"
import { CanvasMode, CanvasSetting, Point } from "types/canvas"
import BurgerMenu from "./BurgerMenu"
import { CustomizationBar } from "./CustomizationBar"
import Notification from "./Notification"
import Toolbar from "./Toolbar"
import ToolButton from "./ToolButton"
let lastPath: Point[] = []

import "./App.css"
import { CustomCursor } from "./CustomCursor"

type CanvasProps = {
    boardId: string
    settings: React.MutableRefObject<CanvasSetting>
    size: WindowSize
}

export default function Canvas({ settings, size }: CanvasProps) {
    // const ORIGIN: Point = [0, 0]
    // const [viewportTopLeft, setViewportTopLeft] = useState<Point>(ORIGIN)
    const PAN_LIMIT = 7000
    const width = Math.min(size.width, PAN_LIMIT)
    const height = Math.min(size.height, PAN_LIMIT)
    const [drawing, setDrawing] = useState<boolean>(false)
    const isDrawing = useRef<boolean>(false)
    const [, render] = useReducer(prev => !prev, false)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

    const coords = useRef<Point>([0, 0])

    const isMoving = useRef<boolean>(false)
    const importInput = useRef<HTMLInputElement | null>(null)

    const {
        importHistory,
        pushHistory,
        popHistory,
        redoHistory,
        getHistory,
        getRedoHistory,
    } = useHistoryContext()

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
        isDrawing.current = true
        setDrawing(true)
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
        isDrawing.current = false
        setDrawing(false)
        if (lastPath.length > 0) {
            pushHistory({ ...settings.current, path: lastPath })
            lastPath = []
            drawCanvas(getContext())
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
        console.log("move:", x2, y2, ntdx, ntdy)
        ctx.setTransform(1, 0, 0, 1, ntdx, ntdy)
        drawCanvas(ctx)
        coords.current = [x2, y2]
        console.log("on move:", x2, y2)
    }

    const onPointerMove: EventListenerOrEventListenerObject = e => {
        prevent(e)
        if (isMoving.current) return onCanvasMove(e as any, ctxRef.current!)
        if (!isDrawing.current) return
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

            case CanvasMode.Line:
                if (point) {
                    path.length === 0 ? (path[0] = point) : (path[1] = point)
                    previewLine(path, ctx)
                } else {
                    if (path.length === 1) path[1] = path[0]
                    drawLine(path, ctx)
                }
                break

            case CanvasMode.Rect:
                if (point) {
                    path.length === 0 ? (path[0] = point) : (path[1] = point)
                    previewRect(path, ctx)
                } else {
                    if (path.length === 1) path[1] = path[0]
                    drawRect(path, ctx)
                }
                break
            case CanvasMode.Ellipse:
                if (point) {
                    path.length === 0 ? (path[0] = point) : (path[1] = point)
                    previewCircle(path, ctx)
                } else {
                    if (path.length === 1) path[1] = path[0]
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

    const previewLine = (path: Point[], ctx: CanvasRenderingContext2D) => {
        if (path.length < 2) return
        drawCanvas(ctx)
        drawLine(path, getContext(settings.current, ctx))
        // ctx.beginPath()
        // ctx.moveTo(path[0][0], path[0][1])
        // ctx.lineTo(path[1][0], path[1][1])
        // ctx.stroke()
    }

    const drawLine = (path: Point[], ctx: CanvasRenderingContext2D) => {
        ctx.beginPath()
        ctx.moveTo(path[0][0], path[0][1])
        ctx.lineTo(path[1][0], path[1][1])
        ctx.stroke()
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
        if (lastPath.length === 0) {
            ctx.beginPath()
            ctx.moveTo(point[0], point[1])
        }
        ctx.lineTo(point[0], point[1])
        ctx.stroke()
        lastPath.push(point)
    }

    const drawPen = (points: Point[], ctx: CanvasRenderingContext2D) => {
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

    const undoCanvas = (
        e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent,
    ) => {
        if (e instanceof MouseEvent) {
            prevent(e)
        }
        if (getHistory().length === 0) return
        popHistory()
        drawCanvas(getContext())
        render()
    }

    const redoCanvas = (
        e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent,
    ) => {
        if (e instanceof MouseEvent) {
            prevent(e)
        }
        redoHistory()
        drawCanvas(getContext())
        render()
    }

    const setMode = (mode: CanvasMode) => {
        settings.current.mode = mode
        render()
    }

    useEffect(() => {
        document.addEventListener("pointerup", onPointerUp)
        document.addEventListener("pointermove", onPointerMove)
        getContext().setTransform(
            1,
            0,
            0,
            1,
            -(PAN_LIMIT - width) / 2,
            -(PAN_LIMIT - height) / 2,
        )
        drawCanvas(getContext())
        return () => {
            document.removeEventListener("pointerup", onPointerUp)
            document.removeEventListener("pointermove", onPointerMove)
        }
    }, [width, height])

    const changeColor = (color: string) => {
        settings.current.color = color
    }

    // const exportCanvasAsJSON = () => {
    //     const link = document.createElement("a")
    //     const content = JSON.stringify(getHistory())
    //     const file = new Blob([content], { type: "application/json" })
    //     link.href = URL.createObjectURL(file)
    //     link.download = `chalkboard_${Date.now()}.json`
    //     link.click()
    //     URL.revokeObjectURL(link.href)
    //     toast.success("Chalkboard Downloaded Successfully")
    // }

    const importCanvas = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length === 0) return
        const file = e.target.files![0]
        if (!file.name.endsWith(".chalkboard")) {
            toast.error("Please select a .chalkboard file.")
            return
        }
        const reader = new FileReader()
        reader.onload = () => {
            try {
                // const data = JSON.parse(reader.result as string)
                // if (!validateHistoryArray(data)) {
                //     toast.error("Invalid Chalkboard File")
                // }
                // importHistory(data)
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
    console.log("history", getHistory())

    const onImportClick = () => {
        importInput.current?.click()
    }
    return (
        <>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onPointerDown={onPointerDown}
                className={cn(
                    settings.current.mode === CanvasMode.None
                        ? "cursor-default"
                        : "",
                    settings.current.mode === CanvasMode.Pan ? "moving" : "",
                    settings.current.mode === CanvasMode.Pencil ||
                        settings.current.mode === CanvasMode.Line ||
                        settings.current.mode === CanvasMode.Rect ||
                        settings.current.mode === CanvasMode.Ellipse
                        ? "cursor-none"
                        : "",
                )}
            />
            <Toolbar
                canvasMode={settings.current.mode}
                setCanvasMode={setMode}
                canRedo={getRedoHistory().length === 0}
                canUndo={getHistory().length === 0}
                undo={undoCanvas}
                redo={redoCanvas}
            />

            {settings.current.mode !== CanvasMode.Pan &&
                settings.current.mode !== CanvasMode.None && (
                    <CustomizationBar
                        settings={settings}
                        // color={settings.current.color}
                        // setColor={changeColor}
                    />
                )}
            <BurgerMenu openFile={onImportClick}>
                <div>
                    <input
                        ref={importInput}
                        className="hidden"
                        type="file"
                        accept=".chalkboard"
                        onChange={importCanvas}
                    />
                    <ToolButton label="menu" icon={Menu} />
                </div>
            </BurgerMenu>

            {settings.current.mode !== CanvasMode.None &&
                settings.current.mode !== CanvasMode.Pan && (
                    <CustomCursor size={settings.current.stroke} />
                )}
            <Notification position="top-center" />
        </>
    )
}
