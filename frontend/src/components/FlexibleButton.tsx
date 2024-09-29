import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";
import Hint from "./Hint";

type FlexibleButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isSidebar?: boolean;
  sidebarCollapsed?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
};

export default function FlexibleButton({
  icon: Icon,
  label,
  onClick,
  className,
  isActive,
  isDisabled,
  isSidebar = false,
  sidebarCollapsed = false,
  side = "right",
  align,
  sideOffset = 12,
  alignOffset,
}: FlexibleButtonProps) {
  const buttonContent = (
    <Button
      variant={isActive ? "bordActive" : "bord"}
      className={cn(
        "p-2",
        isSidebar && !sidebarCollapsed && "justify-start gap-4",
        className,
      )}
      size={isSidebar && !sidebarCollapsed ? "auto" : "icon"}
      onClick={onClick}
      disabled={isDisabled}
    >
      <Icon
        className={cn(
          "h-6 w-6 transition-all hover:transition-all",
          isSidebar && !sidebarCollapsed && "h-5 w-5",
        )}
      />
      {isSidebar && !sidebarCollapsed && <span>{label}</span>}
    </Button>
  );

  return (
    <Hint
      label={label}
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      disable={isSidebar && !sidebarCollapsed}
    >
      {buttonContent}
    </Hint>
  );
}

// type ToolButtonProps = {
//     className?: string | undefined
//     label: string
//     side?: "top" | "bottom" | "left" | "right"
//     icon: LucideIcon
//     onClick?: React.MouseEventHandler<any> | undefined
//     isActive?: boolean
//     isDisabled?: boolean
// }
// export default function ToolButton({
//     className,
//     label,
//     side,
//     icon: Icon,
//     onClick,
//     isActive,
//     isDisabled,
// }: ToolButtonProps) {
//     return (
//         <Hint label={label} side={side ?? "right"} sideOffset={12}>
//             <Button
//                 className={cn("p-1", className)}
//                 disabled={isDisabled}
//                 onClick={onClick}
//                 size={"icon"}
//                 variant={isActive ? "bordActive" : "bord"}
//             >
//                 <Icon />
//             </Button>
//         </Hint>
//     )
// }
