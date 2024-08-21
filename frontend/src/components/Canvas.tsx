import React, { useEffect, useRef, useState } from "react"
import Toolbar from "./Toolbar"
import { CanvasMode, CanvasState, Layer, LayerType } from "types/canvas"
import { Color } from "@rc-component/color-picker"
import { PenMenu } from "./PenMenu"
import { usePathLayer } from "src/hooks/usePathLayer"
import { useWindowSize } from "src/hooks/useWindowSize"
import { useZoom } from "src/hooks/useZoom"

type CanvasProps = {
    boardId: string
}

export default function Canvas({ boardId }: CanvasProps) {
    const [layers, setLayers] = useState<Layer[]>([])
    const { windowWidth, windowHeight } = useWindowSize()
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    })

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const [lineColor, setLineColor] = useState<Color>(new Color("#000000"))
    const [lineSize, setLineSize] = useState<number>(5) // Line width

    const { pathLayer, startNewPath, drawCurrentPath, finishCurrentPath } =
        usePathLayer(canvasRef, ctxRef)

    const { startPan, reset, scale, offset, ratio, viewportTopLeft } = useZoom(
        canvasRef,
        ctxRef,
        windowWidth,
        windowHeight,
    )

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.lineCap = "round"
                ctx.lineWidth = lineSize
                canvas.width = windowWidth
                canvas.height = windowHeight
                ctxRef.current = ctx
            }
        }
    }, [lineSize, windowWidth, windowHeight])

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (canvasState.mode === CanvasMode.Pencil) {
            startNewPath(e, lineColor, lineSize)
        } else {
            startPan(e)
        }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (canvasState.mode === CanvasMode.Pencil) {
            drawCurrentPath(e)
        }
    }

    const handleMouseUp = () => {
        if (canvasState.mode === CanvasMode.Pencil) {
            finishCurrentPath()
            setLayers([...layers, pathLayer])
        }
    }

    return (
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                scale={scale}
                canRedo={false}
                canUndo={false}
                undo={() => {}}
                redo={() => {}}
            />

            {canvasState.mode === CanvasMode.Pencil && (
                <PenMenu
                    lineColor={lineColor}
                    setLineColor={setLineColor}
                    lineSize={lineSize}
                    setLineSize={setLineSize}
                />
            )}

            <canvas
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                ref={canvasRef}
                className="h-full w-full touch-none bg-white"
            />
        </main>
    )
}
