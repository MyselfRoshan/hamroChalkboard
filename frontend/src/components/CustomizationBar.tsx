import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Slider } from "components/ui/slider"
import React, { useEffect, useRef, useState } from "react"
import { CanvasSetting } from "types/canvas"
import Hint from "./Hint"

const useHoverTooltip = () => {
    const [isHovered, setIsHovered] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseEnter = () => setIsHovered(true)
        const handleMouseLeave = () => setIsHovered(false)

        const element = elementRef.current
        if (element) {
            element.addEventListener("mouseenter", handleMouseEnter)
            element.addEventListener("mouseleave", handleMouseLeave)
        }

        return () => {
            if (element) {
                element.removeEventListener("mouseenter", handleMouseEnter)
                element.removeEventListener("mouseleave", handleMouseLeave)
            }
        }
    }, [])

    return { elementRef, isHovered }
}
// Define the types for the props
type MenuProps = {
    settings: React.MutableRefObject<CanvasSetting>
    originalPoints?: number // Add this prop
    reducedPoints?: number // Add this prop
}

export const CustomizationBar: React.FC<MenuProps> = ({
    settings,
    originalPoints = 0,
    reducedPoints = 0,
}) => {
    const [color, setColor] = useState(settings.current.color)
    const [stroke, setStroke] = useState(settings.current.stroke)
    const [rdpEpsilon, setRdpEpsilon] = useState(settings.current.rdpEpsilon)
    useEffect(() => {
        settings.current.color = color
    }, [color])

    // Separate refs for each slider
    const strokeSliderRef = useRef<HTMLDivElement>(null)
    const epsilonSliderRef = useRef<HTMLDivElement>(null)

    function handleWidthChange(value: number[]): void {
        setStroke(value[0])
        settings.current.stroke = value[0]
    }

    function handleRDPEplisonChange(value: number[]): void {
        setRdpEpsilon(value[0])
        settings.current.rdpEpsilon = value[0]
    }

    const strokeSlider = useHoverTooltip()
    const epsilonSlider = useHoverTooltip()
    return (
        <>
            <div className="align-center absolute left-2 top-2 flex w-[350px] flex-col gap-2 rounded-md bg-white p-1.5 shadow-md">
                <h2 className="font-bold">Ramer-Douglas-Peucker algorithm</h2>
                <div className="flex w-full gap-2">
                    <Label htmlFor="rdpEplison">Epsilon</Label>
                    <Hint
                        label={rdpEpsilon.toString()}
                        side="top"
                        sideOffset={14}
                        open={epsilonSlider.isHovered}
                    >
                        <Slider
                            ref={epsilonSlider.elementRef}
                            id="rdpEplison"
                            min={0}
                            max={10}
                            step={0.5}
                            value={[rdpEpsilon]}
                            onValueChange={handleRDPEplisonChange}
                        />
                    </Hint>
                </div>
                {/* RDP STats */}
                <h3 className="mt-3 font-bold">Stats</h3>
                <div className="text-xs text-gray-600">
                    <span className="font-bold">Original Points:</span>{" "}
                    {originalPoints}
                    <br />
                    <span className="font-bold">Reduced Points:</span>{" "}
                    {reducedPoints}
                    {originalPoints > 0 && (
                        <>
                            <br />
                            <span className="font-bold">Reduction:</span>{" "}
                            {Math.round(
                                ((originalPoints - reducedPoints) /
                                    originalPoints) *
                                    100,
                            )}
                            %
                        </>
                    )}
                </div>
            </div>
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
                    open={strokeSlider.isHovered}
                >
                    <Slider
                        ref={strokeSlider.elementRef}
                        id="stroke"
                        min={3}
                        max={25}
                        step={1}
                        value={[stroke]}
                        onValueChange={handleWidthChange}
                    />
                </Hint>
            </div>
        </>
    )
}
