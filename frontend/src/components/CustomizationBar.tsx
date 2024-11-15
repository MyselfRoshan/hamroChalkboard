import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Slider } from "components/ui/slider"
import React, { useEffect, useRef, useState } from "react"
import { CanvasSetting } from "types/canvas"
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
        <div className="absolute bottom-2 right-[50%] flex w-[350px] translate-x-[50%] items-center gap-2 rounded-md bg-white p-1.5 shadow-md">
            <Label htmlFor="color">Color</Label>
            <Input
                className="h-7 w-7 p-0"
                type="color"
                onChange={(e) => setColor(e.target.value)}
            />
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
                    min={3}
                    max={25}
                    step={1}
                    value={[stroke]}
                    onValueChange={handleWidthChange}
                />
            </Hint>
        </div>
    )
}
