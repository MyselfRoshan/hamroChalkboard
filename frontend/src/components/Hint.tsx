import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "components/ui/tooltip"
import React from "react"

export type HintProps = {
    label: string
    children: React.ReactNode
    side?: "top" | "bottom" | "left" | "right"
    align?: "start" | "center" | "end"
    sideOffset?: number
    alignOffset?: number
    open?: boolean
    disable?: boolean
}
export default function Hint({
    label,
    children,
    side,
    align,
    sideOffset,
    alignOffset,
    open,
    disable = false,
}: HintProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100} open={open}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    hidden={disable}
                    className={"border-black bg-black text-white"}
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    alignOffset={alignOffset}
                >
                    <span className="font-semibold capitalize">{label}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
