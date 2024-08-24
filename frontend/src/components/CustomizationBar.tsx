import { Label } from "components/ui/label"
import { Slider } from "components/ui/slider"
import React, { useEffect, useRef, useState } from "react"
import { CanvasSetting } from "types/canvas"
import ClrPicker from "./Colorpicker"
import Hint from "./Hint"

// Define the types for the props
type MenuProps = {
    settings: React.MutableRefObject<CanvasSetting>
}

export const CustomizationBar: React.FC<MenuProps> = ({ settings }) => {
    const [color, setColor] = useState(settings.current.color)
    const [stroke, setStroke] = useState(settings.current.stroke)
    useEffect(() => {
        settings.current.color = color
    }, [color])
    const [showSizeNum, setShowSizeNum] = useState(false)
    const sliderRef = useRef<HTMLDivElement>(null)

    function handleWidthChange(value: number[]): void {
        setShowSizeNum(true)
        setStroke(value[0])
        settings.current.stroke = value[0]
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
                <ClrPicker color={color} setColor={setColor} />
            </div>
            <Label htmlFor="stroke">Stroke</Label>
            <Hint
                label={stroke.toString()}
                side="top"
                sideOffset={14}
                open={showSizeNum}
            >
                <Slider
                    ref={sliderRef}
                    id="stroke"
                    min={1}
                    max={25}
                    step={1}
                    value={[stroke]}
                    onValueChange={handleWidthChange}
                />
            </Hint>
        </div>
    )
}
