import React, { useState, useEffect, useRef } from "react"
import { Slider } from "components/ui/slider"
import { Label } from "components/ui/label"
import Hint from "./Hint"
import ClrPicker from "./Colorpicker"
import { Color } from "@rc-component/color-picker"

// Define the types for the props
type MenuProps = {
    color: Color
    setColor: (color: Color) => void
    // size: number
    // seteSize: (width: number) => void
}

export const PenMenu: React.FC<MenuProps> = ({
    color: lineColor,
    setColor: setLineColor,
    // size: lineSize,
    // seteSize: setLineSize,
}) => {
    const [showSizeNum, setShowSizeNum] = useState(false)
    const sliderRef = useRef<HTMLDivElement>(null)

    function handleWidthChange(value: number[]): void {
        // setLineSize(value[0])
        setShowSizeNum(true)
    }

    // Use useEffect to handle mouse enter and leave events
    useEffect(() => {
        const handleMouseEnter = () => setShowSizeNum(true)
        const handleMouseLeave = () => setShowSizeNum(false)

        const slider = sliderRef.current
        if (slider) {
            slider.addEventListener("mouseenter", handleMouseEnter)
            slider.addEventListener("mouseleave", handleMouseLeave)
        }
        return () => {
            if (slider) {
                slider.removeEventListener("mouseenter", handleMouseEnter)
                slider.removeEventListener("mouseleave", handleMouseLeave)
            }
        }
    }, [])

    return (
        <div className="absolute right-[50%] translate-x-[50%] bottom-2 bg-white rounded-md p-1.5 flex gap-2 items-center shadow-md w-[350px]">
            <Label htmlFor="color">Color</Label>
            <div>
                <ClrPicker color={lineColor} setColor={setLineColor} />
            </div>
            <Label htmlFor="size">Size</Label>
            {/* <Hint
                label={lineSize.toString()}
                side="top"
                sideOffset={14}
                open={showSizeNum}
            >
                <Slider
                    ref={sliderRef}
                    id="size"
                    min={1}
                    max={25}
                    step={1}
                    value={[lineSize]}
                    onValueChange={handleWidthChange}
                />
            </Hint> */}
        </div>
    )
}
