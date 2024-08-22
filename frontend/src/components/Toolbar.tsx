import React, { useState } from "react"
import { CanvasMode, LayerType } from "types/canvas"

import ToolButton from "./ToolButton"
import {
    Circle,
    Hand,
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
import Hint from "./Hint"
import { PenMenu } from "./PenMenu"
import { Color } from "@rc-component/color-picker"

type ToolbarProps = {
    // canvasState: CanvasState
    // setCanvasState: (newState: CanvasState) => void
    canvasMode: CanvasMode
    setCanvasMode: (mode: CanvasMode) => () => void
    undo: (e: React.MouseEvent<HTMLButtonElement>) => void
    redo: (e: React.MouseEvent<HTMLButtonElement>) => void
    canUndo: boolean
    canRedo: boolean
    color: Color
    setColor: (color: Color) => void
    // undo: () => void
    // redo: () => void
    // scale: number
    // zoomLevel: number
    // setZoomLevel: (level: number) => void
    // resetZoom: () => void
    // setZoomLevel: (level: number) => void
}
export default function Toolbar({
    // canvasState,
    // setCanvasState,
    canvasMode,
    setCanvasMode,
    undo,
    redo,
    canUndo,
    canRedo,
    color,
    setColor,
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
            mode: CanvasMode.Circle,
            label: "Ellipse",
            icon: Circle,
        },
    ]
    return (
        <div className="absolute top-[50%] translate-y-[50%] right-2 grid gap-y-4">
            <div className="bg-white rounded-md p-1.5 grid gap-y-1 items-center shadow-md">
                {modeButtons.map(btn => (
                    <ToolButton
                        key={btn.mode}
                        label={btn.label}
                        icon={btn.icon}
                        isActive={canvasMode === btn.mode}
                        onClick={() => {
                            console.log(btn.mode)
                            setCanvasMode(btn.mode)
                            // setCanvasState({ mode: CanvasMode.None })
                        }}
                    />
                ))}
                {/* <ToolButton
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
                    label="Hand"
                    icon={Hand}
                    isActive={canvasState.mode === CanvasMode.Panning}
                    onClick={() => {
                        setCanvasState({ mode: CanvasMode.Panning })
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
                /> */}
            </div>

            <div className="bg-white rounded-md p-1.5 grid gap-y-1 items-center shadow-md">
                <ToolButton
                    label="Undo"
                    icon={Undo2}
                    isActive={false}
                    onClick={undo}
                    isDisabled={canUndo}
                />
                <ToolButton
                    label="Undo"
                    icon={Redo2}
                    isActive={false}
                    onClick={redo}
                    isDisabled={canRedo}
                />
            </div>
            <PenMenu
                color={new Color("#000000")}
                setColor={color => setColor(color)}
                // setColor={color => console.log(color)}
                // size={1}
                // seteSize={size => console.log(size)}
            />

            {/* <div className="bg-white rounded-md p-1.5 flex flex-col justify-center gap-y-1 items-center shadow-md">
                <ToolButton
                    label="Zoom In"
                    icon={Plus}
                    onClick={() => {
                        setZoomLevel(0.1)
                    }}

                    // isActive={false}
                    // onClick={zoomIn}
                    // isDisabled={!canUndo}
                />
                <Hint label="Reset Zoom" side="left" sideOffset={14}>
                    <p
                        className="w-10 h-10 p-1 focus-visible:outline-none text-center"
                        onClick={() => resetZoom()}
                    >
                        {Math.floor(scale * 100)}
                    </p>
                </Hint>
                <ToolButton
                    label="Zoom Out"
                    icon={Minus}
                    isActive={false}
                    onClick={() => {
                        setZoomLevel(-0.1)
                    }}
                    // onClick={() => {}}
                    // onClick={zoomOut}
                    // isDisabled={!canRedo}
                />
            </div> */}
        </div>
    )
}
