import React, { useEffect, useRef, useState } from "react"
import Toolbar from "./Toolbar"

import { CanvasMode, CanvasState } from "types/canvas"
import { PenMenu } from "./PenMenu"
import { Color } from "@rc-component/color-picker"
// import { parseColor } from "@react-spectrum/color"
// import { useColor } from "react-color-palette"

type CanvasProps = {
    boardId: string
}
export default function Canvas({ boardId }: CanvasProps) {
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    })

    // const history = useHistory()

    // Drawing in Canvas
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [lineWidth, setLineWidth] = useState<number>(1)
    const [lineColor, setLineColor] = useState("#000000")
    // Color.
    // const [lineColor, setLineColor] = useState(parseColor("hsl(0, 0%, 0%)"))
    // const [lineColor, setLineColor] = useColor("hsl(0, 0%, 0%)")
    // const [lineOpacity, setLineOpacity] = useState<number>(1)
    var canvasWidth: number = window.innerWidth
    var canvasHeight: number = window.innerHeight

    const resizeCanvas = () => {
        const canvas = canvasRef.current
        if (canvas) {
            canvasWidth = window.innerWidth
            canvasHeight = window.innerHeight
        }
    }
    useEffect(() => {
        resizeCanvas() // Set initial size
        window.addEventListener("resize", resizeCanvas) // Adjust size on resize

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])
    // Initialization when the component mounts for the first time
    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.lineCap = "round"
                // ctx.globalAlpha = lineOpacity
                ctx.strokeStyle = lineColor.toString()
                ctx.lineWidth = lineWidth
                ctxRef.current = ctx

                // ctx.fillStyle = "green"
                // ctx.fillRect(10, 10, 150, 100)
            }
        }
    }, [lineColor, lineWidth])
    // }, [lineColor, lineOpacity, lineWidth])

    // Function for starting the drawing
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (ctxRef.current) {
            const rect = canvasRef.current?.getBoundingClientRect()
            const offsetX = e.clientX - (rect?.left || 0)
            const offsetY = e.clientY - (rect?.top || 0)

            ctxRef.current.beginPath()
            ctxRef.current.moveTo(offsetX, offsetY)
            setIsDrawing(true)
        }
    }

    // Function for ending the drawing
    const endDrawing = () => {
        if (ctxRef.current) {
            ctxRef.current.closePath()
            setIsDrawing(false)
        }
    }

    // Function for drawing
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !ctxRef.current) {
            return
        }
        const rect = canvasRef.current?.getBoundingClientRect()
        const offsetX = e.clientX - (rect?.left || 0)
        const offsetY = e.clientY - (rect?.top || 0)

        ctxRef.current.lineTo(offsetX, offsetY)
        ctxRef.current.stroke()
    }
    // End of drawing in canvas

    return (
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={false}
                canUndo={false}
                undo={() => {}}
                redo={() => {}}
            />

            {canvasState.mode === CanvasMode.Pencil && (
                <PenMenu
                    lineColor={lineColor}
                    setLineColor={setLineColor}
                    lineWidth={lineWidth}
                    setLineWidth={setLineWidth}
                />
            )}

            <canvas
                onMouseDown={
                    canvasState.mode === CanvasMode.Pencil
                        ? startDrawing
                        : () => {}
                }
                onMouseUp={
                    canvasState.mode === CanvasMode.Pencil
                        ? endDrawing
                        : () => {}
                }
                onMouseMove={
                    canvasState.mode === CanvasMode.Pencil ? draw : () => {}
                }
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
            />
        </main>
    )
}
