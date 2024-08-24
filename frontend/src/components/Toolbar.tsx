import React from "react"
import { CanvasMode } from "types/canvas"

import { Circle, Hand, Pencil, Redo2, Square, Undo2 } from "lucide-react"
import ToolButton from "./ToolButton"

type ToolbarProps = {
    // canvasState: CanvasState
    // setCanvasState: (newState: CanvasState) => void
    canvasMode: CanvasMode
    setCanvasMode: (mode: CanvasMode) => void
    undo: (e: React.MouseEvent<HTMLButtonElement>) => void
    redo: (e: React.MouseEvent<HTMLButtonElement>) => void
    canUndo: boolean
    canRedo: boolean
    // color: Color
    // setColor: (color: Color) => void
    // undo: () => void
    // redo: () => void
    // zoomLevel: number
    // scale: number
    // setZoomLevel: (level: number) => void
    // resetZoom: () => void
}
export default function Toolbar({
    canvasMode,
    setCanvasMode,
    undo,
    redo,
    canUndo,
    canRedo,
    // color,
    // setColor,
    // scale,
    // resetZoom,
    // setZoomLevel,
    // zoomLevel,
    // setZoomLevel,
}: ToolbarProps) {
    const modeButtons = [
        {
            mode: CanvasMode.Pan,
            label: "Hand",
            icon: Hand,
        },
        {
            mode: CanvasMode.Pencil,
            label: "Pen",
            icon: Pencil,
        },
        {
            mode: CanvasMode.Rect,
            label: "Rectangle",
            icon: Square,
        },
        {
            mode: CanvasMode.Ellipse,
            label: "Ellipse",
            icon: Circle,
        },
    ]
    return (
        <>
            <div className="absolute top-[50%] right-2 bg-white rounded-md p-1.5 grid gap-y-1 items-center shadow-md">
                {modeButtons.map(btn => (
                    <ToolButton
                        key={btn.mode}
                        label={btn.label}
                        icon={btn.icon}
                        isActive={canvasMode === btn.mode}
                        onClick={() => setCanvasMode(btn.mode)}
                    />
                ))}
            </div>
            <div className="absolute bottom-2 right-2 bg-white rounded-md p-1.5 flex gap-1 shadow-md">
                <ToolButton
                    label="Undo"
                    side="top"
                    icon={Undo2}
                    isActive={false}
                    onClick={undo}
                    isDisabled={canUndo}
                />
                <ToolButton
                    label="Undo"
                    side="top"
                    icon={Redo2}
                    isActive={false}
                    onClick={redo}
                    isDisabled={canRedo}
                />
            </div>
        </>
    )
}
