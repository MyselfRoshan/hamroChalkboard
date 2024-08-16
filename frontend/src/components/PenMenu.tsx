// import React, { useState } from "react"
// import "./App.css"
// import { Slider } from "components/ui/slider"
// import { cn } from "lib/utils"
// import { Label } from "components/ui/label"
// import {
//     Color,
//     ColorEditor,
//     ColorPicker,
//     parseColor,
// } from "@react-spectrum/color"
// import Hint from "./Hint"

// // Define the types for the props
// type MenuProps = {
//     lineColor: Color
//     setLineColor: (color: Color) => void
//     lineWidth: number
//     setLineWidth: (width: number) => void
// }

// export const PenMenu: React.FC<MenuProps> = ({
//     lineColor,
//     setLineColor,
//     lineWidth,
//     setLineWidth,
// }) => {
//     // const [penSize, setPenSize] = useState(1)
//     const [showSizeNum, setShowSizeNum] = useState(false)
//     function handleColorChange(color: Color) {
//         setLineColor(color)
//     }
//     window.addEventListener("hover", () => setShowSizeNum(false))

//     function handleWidthChange(value: number[]): void {
//         setLineWidth(value[0])
//         setShowSizeNum(true)
//     }

//     return (
//         <div className="absolute right-[50%] translate-x-[50%] bottom-2 bg-white rounded-md p-1.5 flex gap-2 items-center shadow-md w-[450px]">
//             <Label htmlFor="color">Color</Label>
//             <div className="w-8 h-[100%] "></div>
//             <ColorPicker
//                 defaultValue={lineColor}
//                 label="Color"
//                 onChange={handleColorChange}
//             >
//                 <ColorEditor />
//             </ColorPicker>
//             <div className="realtive"></div>
//             <Label htmlFor="size">Size</Label>
//             <Hint
//                 label={lineWidth.toString()}
//                 side="top"
//                 sideOffset={14}
//                 open={showSizeNum}
//             >
//                 <Slider
//                     id="size"
//                     min={1}
//                     max={25}
//                     step={1}
//                     onValueChange={handleWidthChange}
//                 />
//             </Hint>
//         </div>
//     )
// }

import React, { useState, useEffect, useRef } from "react"
import "./App.css"
import { Slider } from "components/ui/slider"
import { Label } from "components/ui/label"
// import { Color, ColorEditor, ColorPicker } from "@react-spectrum/color"
import Hint from "./Hint"
import ClrPicker from "./Colorpicker"
import { Color } from "@rc-component/color-picker"
// import {
//     Alpha,
//     ColorPicker,
//     Hue,
//     IColor,
//     Saturation,
//     useColor,
// } from "react-color-palette"

// Define the types for the props
type MenuProps = {
    lineColor: Color
    setColor: (color: Color | string) => void
    lineWidth: number
    setLineWidth: (width: number) => void
}

export const PenMenu: React.FC<MenuProps> = ({
    lineColor,
    setLineColor,
    lineWidth,
    setLineWidth,
}) => {
    const [showSizeNum, setShowSizeNum] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    function handleColorChange(color: IColor) {
        setLineColor(color)
    }

    function handleWidthChange(value: number[]): void {
        setLineWidth(value[0])
        setShowSizeNum(true)
    }

    // Use useEffect to handle mouse enter and leave events
    useEffect(() => {
        const handleMouseEnter = () => setShowSizeNum(true)
        const handleMouseLeave = () => setShowSizeNum(false)

        const container = containerRef.current
        if (container) {
            container.addEventListener("mouseenter", handleMouseEnter)
            container.addEventListener("mouseleave", handleMouseLeave)
        }

        // Cleanup event listeners on component unmount
        return () => {
            if (container) {
                container.removeEventListener("mouseenter", handleMouseEnter)
                container.removeEventListener("mouseleave", handleMouseLeave)
            }
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="absolute right-[50%] translate-x-[50%] bottom-2 bg-white rounded-md p-1.5 flex gap-2 items-center shadow-md w-[450px]"
        >
            <Label htmlFor="color">Color</Label>
            <div className="w-8 h-[100%] "></div>
            {/* <ColorPicker
                defaultValue={lineColor}
                label="Color"
                onChange={handleColorChange}
            >
                <ColorEditor />
            </ColorPicker> */}

            {/* <div className="absolute right-[50%] bottom-8  shadow-md"> */}
            <div className="absolute bottom-12">
                {/* <ColorPicker
                    color={lineColor}
                    onChange={handleColorChange}
                    hideAlpha={false}
                /> */}
                <ClrPicker color={lineColor} setColor={setLineColor} />
                {/* rc-color-picker-color-block */}
            </div>
            <Label htmlFor="size">Size</Label>
            <Hint
                label={lineWidth.toString()}
                side="top"
                sideOffset={14}
                open={showSizeNum}
            >
                <Slider
                    id="size"
                    min={1}
                    max={25}
                    step={1}
                    onValueChange={handleWidthChange}
                />
            </Hint>
        </div>
    )
}
