import React from "react"
import ToolTip from "./Hint"
import { Icon, LucideIcon } from "lucide-react"
import Hint from "./Hint"
import { Button } from "components/ui/button"

interface ToolButtonProps {
    label: string
    icon: LucideIcon
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    isActive?: boolean
    isDisabled?: boolean
}
export default function ToolButton({
    label,
    icon: Icon,
    onClick,
    isActive,
    isDisabled,
}: ToolButtonProps) {
    return (
        <div>
            <Hint label={label} side="left" sideOffset={14}>
                <Button
                    // className="rounded-full"
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
