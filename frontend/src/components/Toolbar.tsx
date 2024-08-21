import React, { useState } from "react"
import { CanvasMode, CanvasState, LayerType } from "types/canvas"

import ToolButton from "./ToolButton"
import {
    Circle,
    Minus,
    MousePointer2,
    Pencil,
    Plus,
    Redo2,
    Square,
    StickyNote,
    Type,
    Undo2,
} from "lucide-react"
import { Input } from "components/ui/input"

type ToolbarProps = {
    canvasState: CanvasState
    setCanvasState: (newState: CanvasState) => void
    undo: () => void
    redo: () => void
    scale: number
    canUndo: boolean
    canRedo: boolean
    // zoomLevel: number
    // setZoomLevel: (level: number) => void
}
export default function Toolbar({
    canvasState,
    setCanvasState,
    undo,
    redo,
    scale,
    canUndo,
    canRedo,
    // zoomLevel,
    // setZoomLevel,
}: ToolbarProps) {
    // Zoom in handler
    // const zoomIn = () => {
    //     setZoomLevel(Math.min(zoomLevel * 1.2, 5)) // Max zoom level is 5
    // }

    // // Zoom out handler
    // const zoomOut = () => {
    //     setZoomLevel(Math.max(zoomLevel / 1.2, 0.2)) // Min zoom level is 0.2
    // }
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

            <div className="bg-white rounded-md p-1.5 flex flex-col justify-center gap-y-1 items-center shadow-md">
                <ToolButton
                    label="Zoom In"
                    icon={Plus}
                    onClick={() => {}}

                    // isActive={false}
                    // onClick={zoomIn}
                    // isDisabled={!canUndo}
                />
                <Input
                    className="w-10 h-10 p-1 focus-visible:outline-none text-center"
                    type="text"
                    value={Math.floor(scale * 100)}
                />
                <ToolButton
                    label="Zoom Out"
                    icon={Minus}
                    isActive={false}
                    onClick={() => {}}
                    // onClick={zoomOut}
                    // isDisabled={!canRedo}
                />
            </div>
        </div>
    )
}
