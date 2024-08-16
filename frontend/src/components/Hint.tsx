import React from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "components/ui/tooltip"

export interface HintProps {
    label: string
    children: React.ReactNode
    side?: "top" | "bottom" | "left" | "right"
    align?: "start" | "center" | "end"
    sideOffset?: number
    alignOffset?: number
    open?: boolean
}
export default function Hint({
    label,
    children,
    side,
    align,
    sideOffset,
    alignOffset,
    open,
}: HintProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100} open={open}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    className="text-white bg-black border-black"
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    alignOffset={alignOffset}
                >
                    <p className="font-semibold capitalize">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
