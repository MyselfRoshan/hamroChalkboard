// usePathLayer.ts
import { useState, useRef, useCallback } from "react"
import { PathLayer, LayerType, Layer } from "types/canvas"
import { Color } from "@rc-component/color-picker"

export function usePathLayer(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    ctxRef: React.RefObject<CanvasRenderingContext2D>,
) {
    const [pathLayer, setPathLayer] = useState<PathLayer>({} as PathLayer)
    const isDrawing = useRef(false)
    const currentPath = useRef<PathLayer | null>(null)

    const startNewPath = useCallback(
        (
            event: React.MouseEvent<HTMLCanvasElement>,
            fill: Color,
            size: number,
        ) => {
            if (!ctxRef.current) return

            const { clientX: x, clientY: y } = event
            const rect = canvasRef.current?.getBoundingClientRect()
            const offsetX = x - (rect?.left || 0)
            const offsetY = y - (rect?.top || 0)

            ctxRef.current.beginPath()
            ctxRef.current.moveTo(offsetX, offsetY)

            const newPath: PathLayer = {
                type: LayerType.Path,
                x: offsetX,
                y: offsetY,
                height: 0,
                width: 0,
                fill,
                points: [[offsetX, offsetY]],
                size,
            }
            currentPath.current = newPath
            isDrawing.current = true
        },
        [canvasRef, ctxRef],
    )

    const drawCurrentPath = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement>) => {
            if (!isDrawing.current || !currentPath.current) return

            const { clientX: x, clientY: y } = event
            const rect = canvasRef.current?.getBoundingClientRect()
            const offsetX = x - (rect?.left || 0)
            const offsetY = y - (rect?.top || 0)

            const newPoints = [
                ...currentPath.current.points,
                [offsetX, offsetY],
            ]
            currentPath.current = {
                ...currentPath.current,
                points: newPoints,
            }
            ctxRef.current?.lineTo(offsetX, offsetY)
            ctxRef.current?.stroke()
        },
        [canvasRef, ctxRef],
    )

    const finishCurrentPath = useCallback(() => {
        if (!currentPath.current) return

        setPathLayer(currentPath.current)
        ctxRef.current?.closePath()
        currentPath.current = null
        isDrawing.current = false
    }, [ctxRef])

    return {
        pathLayer,
        startNewPath,
        drawCurrentPath,
        finishCurrentPath,
    }
}
