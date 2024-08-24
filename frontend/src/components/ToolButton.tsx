import { Button } from "components/ui/button"
import { cn } from "lib/utils"
import { LucideIcon } from "lucide-react"
import { MouseEventHandler } from "react"
import Hint from "./Hint"

interface ToolButtonProps {
    className?: string | undefined
    label: string
    side?: "top" | "bottom" | "left" | "right"
    icon: LucideIcon
    onClick?: MouseEventHandler<any> | undefined
    isActive?: boolean
    isDisabled?: boolean
}
export default function ToolButton({
    className,
    label,
    side,
    icon: Icon,
    onClick,
    isActive,
    isDisabled,
}: ToolButtonProps) {
    return (
        <div>
            <Hint label={label} side={side ?? "right"} sideOffset={12}>
                <Button
                    className={cn("p-1", className)}
                    disabled={isDisabled}
                    onClick={onClick}
                    size={"icon"}
                    variant={isActive ? "bordActive" : "bord"}
                >
                    <Icon />
                </Button>
            </Hint>
        </div>
    )
}
