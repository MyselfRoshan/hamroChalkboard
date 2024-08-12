import React from "react"
import "./App.css"
import { Slider } from "components/ui/slider"
import { cn } from "lib/utils"

// Define the types for the props
type MenuProps = {
    setLineColor: (color: string) => void
    setLineWidth: (width: number) => void
    setLineOpacity: (opacity: number) => void
}

export const PenMenu: React.FC<MenuProps> = ({
    setLineColor,
    setLineWidth,
    setLineOpacity,
}) => {
    // Event handler types
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLineColor(e.target.value)
    }

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLineWidth(parseInt(e.target.value))
    }

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLineOpacity(parseFloat(e.target.value) / 100)
    }

    return (
        <div className="absolute right-[50%] translate-x-[50%] bottom-2 bg-white rounded-md p-1.5 flex gap-2 items-center shadow-md">
            <label>Brush Color </label>
            <input type="color" onChange={handleColorChange} />
            <label>Brush Width </label>
            {/* <Slider */}
            <input type="range" min="3" max="20" onChange={handleWidthChange} />
            <label>Brush Opacity</label>
            <input
                type="range"
                min="1"
                max="100"
                onChange={handleOpacityChange}
            />
        </div>
    )
}
