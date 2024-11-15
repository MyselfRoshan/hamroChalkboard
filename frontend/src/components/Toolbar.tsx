import React from "react"
import { CanvasMode } from "types/canvas"

import {
    Circle,
    Hand,
    Pen,
    PencilLine,
    Redo2,
    Square,
    Undo2,
} from "lucide-react"
import useKeyboardShortcuts from "src/hooks/useKeyboardShortcuts"
import FlexibleButton from "./FlexibleButton"

type ToolbarProps = {
    // canvasState: CanvasState
    // setCanvasState: (newState: CanvasState) => void
    canvasMode: CanvasMode
    setCanvasMode: (mode: CanvasMode) => void
    undo: (e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => void
    redo: (e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => void
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
    const shortcuts = {
        "z+ctrl": (e: KeyboardEvent) => undo(e),
        "y+ctrl": (e: KeyboardEvent) => redo(e),
    }

    // Use the custom hook
    useKeyboardShortcuts(shortcuts)
    const modeButtons = [
        {
            mode: CanvasMode.Pan,
            label: "Hand",
            icon: Hand,
        },
        {
            mode: CanvasMode.Line,
            label: "Line",
            icon: PencilLine,
        },
        {
            mode: CanvasMode.Pencil,
            label: "Pen",
            icon: Pen,
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
            <div className="absolute right-2 top-[50%] grid items-center gap-y-1 rounded-md bg-white p-1.5 shadow-md">
                {modeButtons.map((btn) => (
                    <FlexibleButton
                        key={btn.mode}
                        label={btn.label}
                        icon={btn.icon}
                        isActive={canvasMode === btn.mode}
                        onClick={() => setCanvasMode(btn.mode)}
                    />
                ))}
            </div>
            <div className="absolute bottom-2 right-2 flex gap-1 rounded-md bg-white p-1.5 shadow-md">
                <FlexibleButton
                    label="Undo"
                    side="top"
                    icon={Undo2}
                    isActive={false}
                    onClick={undo}
                    isDisabled={canUndo}
                />
                <FlexibleButton
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
