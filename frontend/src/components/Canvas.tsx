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
import { renderCursors } from "src/hooks/usePerfectCursor"
import { WindowSize } from "src/hooks/useWindowSize"
import { CanvasMode, CanvasSetting, Point } from "types/canvas"
import BurgerMenu from "./BurgerMenu"
import { CustomizationBar } from "./CustomizationBar"
import FlexibleButton from "./FlexibleButton"
import Toolbar from "./Toolbar"
let lastPath: Point[] = []

import { Input } from "components/ui/input"
import { useSocketCanvas } from "src/hooks/useSocketCanvas"
import "./App.css"
import { DrawModeCursor } from "./Cursors/DrawModeCursor"

type CanvasProps = {
    settings: React.MutableRefObject<CanvasSetting>
    size: WindowSize
    roomId: string
}

export default function Canvas({ settings, size, roomId }: CanvasProps) {
    const PAN_LIMIT = 7000
    const width = Math.min(size.width, PAN_LIMIT)
    const height = Math.min(size.height, PAN_LIMIT)
    const [drawing, setDrawing] = useState<boolean>(false)
    const isDrawing = useRef<boolean>(false)
    const [, render] = useReducer((prev) => !prev, false)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

    const coords = useRef<Point>([0, 0])

    const isMoving = useRef<boolean>(false)
    const importInput = useRef<HTMLInputElement | null>(null)

    // Zoom state
    const [zoom, setZoom] = useState<number>(1)
    const MIN_ZOOM = 0.5
    const MAX_ZOOM = 5
    const ZOOM_FACTOR = 10

    const {
        importHistory,
        pushHistory,
        popHistory,
        redoHistory,
        getHistory,
        getRedoHistory,
    } = useHistoryContext()

    //   const user: User | null = JSON.parse(localStorage.getItem("auth.user")!);
    //   const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    //     SOCKET_URL,
    //     { queryParams: { username: user!.username } },
    //   );

    //   const THROTTLE_INTERVAL = 300;
    //   const sendJsonMessageThrottled = useRef(
    //     throttle(sendJsonMessage, THROTTLE_INTERVAL),
    //   );

    //   useEffect(() => {
    //     const username = user?.username;
    //     if (!lastJsonMessage) return;
    //     Object.keys(lastJsonMessage).map((u) => {
    //       if (username !== u && lastJsonMessage[u].event === "draw") {
    //         console.log(lastJsonMessage[u].state);
    //         pushHistory(lastJsonMessage[u].state);
    //         getContext(lastJsonMessage.state);
    //         drawCanvas(getContext());
    //       }
    //     });
    //   }, [lastJsonMessage]);

    //   useEffect(() => {
    //     window.addEventListener("mousemove", (event) => {
    //       const cursor = {
    //         x: event.clientX,
    //         y: event.clientY,
    //       };
    //       sendJsonMessageThrottled.current({
    //         event: "mousemove",
    //         cursor,
    //       });
    //     });
    //   });
    //   if (lastJsonMessage && lastJsonMessage.event === "draw") {
    //     console.log(lastJsonMessage.state);
    //   }
    //   const connectionStatus = {
    //     [ReadyState.CONNECTING]: "Connecting",
    //     [ReadyState.OPEN]: "Open",
    //     [ReadyState.CLOSING]: "Closing",
    //     [ReadyState.CLOSED]: "Closed",
    //     [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    //   }[readyState];

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
            sendJsonMessage({
                event: "draw",
                state: { ...settings.current, path: lastPath },
            })
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
        const { a, d, e: tdx, f: tdy } = ctx.getTransform()
        const ntdx = Math.min(Math.max(-(PAN_LIMIT - width), tdx + dx / a), 0)
        const ntdy = Math.min(Math.max(-(PAN_LIMIT - height), tdy + dy / d), 0)
        ctx.setTransform(a, 0, 0, d, ntdx, ntdy)
        drawCanvas(ctx)
        coords.current = [x2, y2]
    }

    const onPointerMove: EventListenerOrEventListenerObject = (e) => {
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
        const { a, d, e: dx, f: dy } = ctx.getTransform()
        const rect = canvasRef.current!.getBoundingClientRect()
        return [(e.clientX - rect.x - dx) / a, (e.clientY - rect.y - dy) / d]
    }

    const previewLine = (path: Point[], ctx: CanvasRenderingContext2D) => {
        if (path.length < 2) return
        drawCanvas(ctx)
        drawLine(path, getContext(settings.current, ctx))
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
        const ctx = getContext()
        ctx.setTransform(
            zoom,
            0,
            0,
            zoom,
            -(PAN_LIMIT - width) / 2,
            -(PAN_LIMIT - height) / 2,
        )
        drawCanvas(ctx)
        return () => {
            document.removeEventListener("pointerup", onPointerUp)
            document.removeEventListener("pointermove", onPointerMove)
        }
    }, [width, height, zoom])

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

    /* TODO: FIX ZOOM along with PAN */
    //   const [scale, setScale] = useState<number>(1); // Scale X (for zooming)

    //   const handleWheel = (e: WheelEvent<HTMLCanvasElement>) => {
    //     const ctx = ctxRef.current!;
    //     if (!ctx) return;

    //     const [x1, y1] = coords.current;
    //     const { clientX: x2, clientY: y2 } = e;
    //     let dx = x2 + x1;
    //     let dy = y2 + y1;
    //     if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    //     const { e: tdx, f: tdy } = ctx.getTransform();
    //     const ntdx = Math.min(Math.max(-(PAN_LIMIT - width), tdx + dx * scale), 0);
    //     const ntdy = Math.min(Math.max(-(PAN_LIMIT - height), tdy + dy * scale), 0);
    //     const newScale = Math.min(
    //       Math.max(0.1, scale - (ZOOM_FACTOR * scale) / e.deltaY),
    //       40,
    //     );
    //     ctx.setTransform(1 / scale, 0, 0, 1 / scale, ntdx, ntdy);
    //     setScale(newScale);
    //     // const zoom = 1 - e.deltaY / 500;
    //     // let dx = (x2 / scale) * (1 - 1 / zoom);
    //     // let dy = (y2 / scale) * (1 - 1 / zoom);
    //     // const ntdx = Math.min(Math.max(-(PAN_LIMIT - width), tdx + dx), 0);
    //     // const ntdy = Math.min(Math.max(-(PAN_LIMIT - height), tdy + dy), 0);
    //     // ctx.translate(dx, dy);
    //     // // ctx.scale(zoom, zoom);
    //     // // ctx.translate(-ntdx, -ntdy);
    //     // ctx.setTransform(zoom, 0, 0, zoom, -ntdx, -ntdy);
    //     // setScale(zoom * scale);
    //     drawCanvas(ctx);
    //     // console.log("on move:", x2, y2, scale, tdx, tdy, ntdx, ntdy);
    //     console.log("on move:", x2, y2, tdx, tdy, ntdx, ntdy, scale);
    //   };
    const SOCKET_URL = `ws://${location.hostname}:3333/api/v1/ws/${roomId}`
    //   const user: User | null = JSON.parse(localStorage.getItem("auth.user")!);
    //   if (!user) return;
    //   const socket = new WebSocket(`${SOCKET_URL}}?username=${user.username}`);

    //   // When the WebSocket connection is opened
    //   socket.onopen = function () {
    //     console.log(`Connected to room: ${roomId}`);
    //   };

    //   // When the WebSocket receives a message
    //   socket.onmessage = function (event) {
    //     const data = JSON.parse(event.data);
    //     console.log("Received message:", data);

    //     // Handle incoming data, e.g., update UI with the new message
    //     // If you're dealing with chat or drawing, use this data to update the UI
    //     displayMessageInRoom(data);
    //   };

    //   // When the WebSocket is closed
    //   socket.onclose = function () {
    //     console.log(`Disconnected from room: ${roomId}`);
    //   };

    //   // Send a message to the WebSocket (could be user input, drawing data, etc.)
    //   function sendMessage(message = "hello") {
    //     const messageData = {
    //       username: username,
    //       message: message,
    //     };
    //     socket.send(JSON.stringify(messageData));
    //   }

    //   // Function to display messages (could be part of your chat or other UI)
    //   function displayMessageInRoom(message: any) {
    //     // Update the UI, e.g., add message to chat window
    //     console.log("Message in room:", message);
    //   }

    const { sendJsonMessage, lastJsonMessage, username } = useSocketCanvas({
        socketURL: SOCKET_URL,
        pushHistory,
        getContext,
        drawCanvas,
    })
    console.log("lastJsonMessage", lastJsonMessage)
    return (
        <>
            {lastJsonMessage && renderCursors(lastJsonMessage, username)}
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onPointerDown={onPointerDown}
                // onWheel={handleWheel}
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
                    <CustomizationBar settings={settings} />
                )}
            <BurgerMenu openFile={() => importInput.current?.click()}>
                <div>
                    <Input
                        ref={importInput}
                        className="hidden"
                        type="file"
                        accept=".chalkboard"
                        onChange={importCanvas}
                    />
                    <FlexibleButton label="menu" icon={Menu} />
                </div>
            </BurgerMenu>

            {settings.current.mode !== CanvasMode.None &&
                settings.current.mode !== CanvasMode.Pan && (
                    <DrawModeCursor size={settings.current.stroke} />
                )}
        </>
    )
}
