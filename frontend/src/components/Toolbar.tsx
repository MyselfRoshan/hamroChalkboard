import React, { useState } from "react"
import { CanvasMode, CanvasState, LayerType } from "types/canvas"

import ToolButton from "./ToolButton"
import {
    Circle,
    MousePointer2,
    Pencil,
    Redo2,
    Square,
    StickyNote,
    Type,
    Undo2,
} from "lucide-react"

type ToolbarProps = {
    canvasState: CanvasState
    setCanvasState: (newState: CanvasState) => void
    undo: () => void
    redo: () => void
    canUndo: boolean
    canRedo: boolean
}
export default function Toolbar({
    canvasState,
    setCanvasState,
    undo,
    redo,
    canUndo,
    canRedo,
}: ToolbarProps) {
    return (
        // <div className="absolute top-[50%] translate-y-[50%] right-2 grid gap-y-4">
        <div className="absolute top-[20%] translate-y-[50%] right-2 grid gap-y-4">
            <div className="bg-white rounded-md p-1.5 grid gap-y-1 items-center shadow-md">
                <ToolButton
                    label="Select"
                    icon={MousePointer2}
                    isActive={
                        canvasState.mode === CanvasMode.None ||
                        canvasState.mode === CanvasMode.Translating ||
                        canvasState.mode === CanvasMode.SelectionNet ||
                        canvasState.mode === CanvasMode.Pressing ||
                        canvasState.mode === CanvasMode.Resizing
                    }
                    onClick={() => {
                        setCanvasState({ mode: CanvasMode.None })
                    }}
                />
                <ToolButton
                    label="Text"
                    icon={Type}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Text
                    }
                    onClick={() => {
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Text,
                        })
                    }}
                />
                <ToolButton
                    label="Sticky note"
                    icon={StickyNote}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Note
                    }
                    onClick={() => {
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Note,
                        })
                    }}
                />
                <ToolButton
                    label="Rectangle"
                    icon={Square}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Rectangle
                    }
                    onClick={() => {
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Rectangle,
                        })
                    }}
                />
                <ToolButton
                    label="Ellipse"
                    icon={Circle}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Ellipse
                    }
                    onClick={() => {
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Ellipse,
                        })
                    }}
                />
                <ToolButton
                    label="Pen"
                    icon={Pencil}
                    isActive={canvasState.mode === CanvasMode.Pencil}
                    onClick={() => {
                        setCanvasState({
                            mode: CanvasMode.Pencil,
                        })
                    }}
                />
            </div>

            <div className="bg-white rounded-md p-1.5 grid gap-y-1 items-center shadow-md">
                <ToolButton
                    label="Undo"
                    icon={Undo2}
                    isActive={false}
                    onClick={undo}
                    isDisabled={!canUndo}
                />
                <ToolButton
                    label="Undo"
                    icon={Redo2}
                    isActive={false}
                    onClick={redo}
                    isDisabled={!canRedo}
                />
            </div>
        </div>
    )
}
