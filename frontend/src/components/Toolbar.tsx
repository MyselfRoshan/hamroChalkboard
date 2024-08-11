import React from "react"
import ToolButton from "./ToolButton"
import {
    Circle,
    MousePointer,
    MousePointer2,
    Pencil,
    Redo2,
    Square,
    StickyNote,
    Type,
    Undo2,
} from "lucide-react"

export default function Toolbar() {
    return (
        <div className="absolute top-[50%] right-2 grid gap-y-4">
            <div className="bg-white rounded-md p-1.5 grid gap-y-1 items-center shadow-md">
                <ToolButton
                    label="Select"
                    icon={MousePointer2}
                    isActive={false}
                    onClick={() => {
                        console.log()
                    }}
                />
                <ToolButton
                    label="Text"
                    icon={Type}
                    isActive={false}
                    onClick={() => {
                        console.log()
                    }}
                />
                <ToolButton
                    label="Sticky note"
                    icon={StickyNote}
                    isActive={false}
                    onClick={() => {
                        console.log()
                    }}
                />
                <ToolButton
                    label="Rectangle"
                    icon={Square}
                    isActive={false}
                    onClick={() => {
                        console.log()
                    }}
                />
                <ToolButton
                    label="Ellipse"
                    icon={Circle}
                    isActive={false}
                    onClick={() => {
                        console.log()
                    }}
                />
                <ToolButton
                    label="Pen"
                    icon={Pencil}
                    isActive={false}
                    onClick={() => {}}
                />
            </div>

            <div className="bg-white rounded-md p-1.5 grid gap-y-1 items-center shadow-md">
                <ToolButton
                    label="Undo"
                    icon={Undo2}
                    isActive={false}
                    onClick={() => {}}
                    isDisabled={true}
                />
                <ToolButton
                    label="Undo"
                    icon={Redo2}
                    isActive={false}
                    onClick={() => {}}
                    isDisabled={true}
                />
            </div>
        </div>
    )
}
