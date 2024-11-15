import { Download, Folder, Keyboard, Settings } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "components/ui/dropdown-menu"
import { useRef, useState } from "react"
import useKeyboardShortcuts from "src/hooks/useKeyboardShortcuts"
import { FileDownloader } from "./FileDownload"

export type DropdownMenuProps = {
    children: React.ReactNode
    // downloadFile: () => void
    // downloadableJSON: () => History[]
    openFile: () => void
}
export default function BurgerMenu({
    children,
    openFile,
    // downloadFile,
    // downloadableJSON,
}: DropdownMenuProps) {
    const shortcuts = {
        "s+ctrl": () => setOpenFileDownloader(true),
        "o+ctrl": openFile,
    }
    useKeyboardShortcuts(shortcuts)

    const fileDownloaderRef = useRef<any>(null)

    const [openFileDownloader, setOpenFileDownloader] = useState(false)
    return (
        <>
            <div className="absolute right-4 top-4 rounded-md bg-white p-1.5 shadow-md">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {children}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        sideOffset={16}
                        className="w-56"
                        collisionPadding={16}
                    >
                        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="hover:bg-yellow-900"
                                onSelect={() => openFile()}
                            >
                                <Folder className="mr-2 h-4 w-4" />
                                <span>Open Board</span>
                                <DropdownMenuShortcut>
                                    Ctrl+O
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => setOpenFileDownloader(true)}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download Chalkboard</span>
                                <DropdownMenuShortcut>
                                    Ctrl+S
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Keyboard className="mr-2 h-4 w-4" />
                                <span>Keyboard shortcuts</span>
                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        {/* <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Team</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Invite users</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span>Email</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    <span>Message</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span>More...</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                        <Plus className="mr-2 h-4 w-4" />
                        <span>New Team</span>
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <Cloud className="mr-2 h-4 w-4" />
                    <span>API</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <FileDownloader
                isOpen={openFileDownloader}
                setIsOpen={setOpenFileDownloader}
            ></FileDownloader>
        </>
    )
}
