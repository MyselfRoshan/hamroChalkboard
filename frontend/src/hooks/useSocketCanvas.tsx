import { useEffect, useRef } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { User } from "src/auth"
import { throttle } from "src/utils/utils"
import { CanvasSetting, Point } from "types/canvas"

type WebSocketMessage = {
    event: string
    state?: CanvasSetting & { path: Point[] }
    cursor?: { x: number; y: number }
}

type UseWebSocketCanvasProps = {
    socketURL: string
    pushHistory: (state: CanvasSetting & { path: Point[] }) => void
    getContext: (state?: CanvasSetting) => CanvasRenderingContext2D
    drawCanvas: (ctx: CanvasRenderingContext2D) => void
}

export const useSocketCanvas = ({
    socketURL,
    pushHistory,
    getContext,
    drawCanvas,
}: UseWebSocketCanvasProps) => {
    const THROTTLE_INTERVAL = 300

    const user: User | null = JSON.parse(localStorage.getItem("auth.user")!)

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        socketURL,
        {
            queryParams: { username: user!.username },
        },
    )

    const sendJsonMessageThrottled = useRef(
        throttle(sendJsonMessage, THROTTLE_INTERVAL),
    )

    useEffect(() => {
        const username = user?.username
        if (!lastJsonMessage) return
        Object.keys(lastJsonMessage).forEach((u) => {
            if (username !== u && lastJsonMessage[u].event === "draw") {
                console.log(lastJsonMessage[u].state)
                pushHistory(lastJsonMessage[u].state)
                getContext(lastJsonMessage[u].state)
                drawCanvas(getContext())
            }
        })
    }, [lastJsonMessage, user, pushHistory, getContext, drawCanvas])

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const cursor = {
                x: event.clientX,
                y: event.clientY,
            }
            sendJsonMessageThrottled.current({
                event: "mousemove",
                cursor,
            })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState]

    return {
        sendJsonMessage,
        lastJsonMessage,
        connectionStatus,
        username: user?.username,
        sendJsonMessageThrottled: sendJsonMessageThrottled.current,
    }
}
