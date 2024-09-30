import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Button } from "components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { cn } from "lib/utils";
import { LayoutGrid, Menu, Settings, User2, Users } from "lucide-react";
import { useAuth } from "src/auth";
import FlexibleButton from "./FlexibleButton";
import Logout from "./Logout";

type SidebarProps = {
  isClosed: boolean;
  setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function Sidebar({ isClosed, setIsClosed }: SidebarProps) {
  console.log(process.env.DB_HOST);
  const { user } = useAuth();
  const avatar = "/placeholder.svg?height=32&width=32";

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutGrid,
      onClick: () => {},
    },
    {
      label: "My Rooms",
      icon: Users,
      onClick: () => {},
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: () => {},
    },
  ];
  return (
    <aside className="sticky top-0 grid h-screen grid-rows-side-bar items-start gap-8 border-r border-primary/30 bg-yellow-200/10 p-4 transition-all duration-300 ease-in-out">
      {/* <aside className="sticky top-0 grid h-screen grid-rows-side-bar items-start gap-8 border-r border-primary/20 bg-card/30 bg-dashboard-image bg-cover bg-[center] bg-no-repeat p-4 backdrop-blur-md transition-all duration-300 ease-in-out"> */}
      <FlexibleButton
        className={cn("mx-0 flex", isClosed && "mx-auto")}
        label="Menu"
        icon={Menu}
        onClick={() => setIsClosed((prev: boolean) => !prev)}
      />
      <nav
        className={cn(
          "mb-auto flex flex-col gap-3",
          isClosed && "items-center",
        )}
      >
        {menuItems.map((item, index) => (
          <FlexibleButton
            className="ease transition-all duration-300"
            key={index}
            label={item.label}
            icon={item.icon}
            onClick={item.onClick}
            isSidebar={true}
            sidebarCollapsed={isClosed}
          />
        ))}
      </nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(!isClosed && "justify-start gap-4")}
            variant="profile"
            size="auto"
          >
            <Avatar className="font-bold">
              <AvatarImage src={avatar} alt={user?.username} />
              <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
            </Avatar>
            {!isClosed && user?.username}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            {/* <Settings className="mr-2 h-4 w-4" /> */}
            <User2 className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Logout as="menu-item" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
}
