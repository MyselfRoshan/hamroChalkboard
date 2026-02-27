// // src/components/HistorySheet.tsx (or wherever you prefer)
// import { Button } from "components/ui/button"
// import {
//     Sheet,
//     SheetClose,
//     SheetContent,
//     SheetDescription,
//     SheetFooter,
//     SheetHeader,
//     SheetTitle,
//     // Note: We won't use SheetTrigger here anymore
// } from "components/ui/sheet"
// import { Calendar, User, Clock } from "lucide-react" // Or any other icons you prefer
// import { formatHistoryDate } from "src/utils/utils"
// import { History } from "types/canvas" // Adjust import path if necessary

// type HistoryItemWithId = History & { id: string } // Add an ID if needed for keys

// type HistorySheetProps = {
//     roomId: string // Pass the roomId to load the correct history
//     open: boolean // Controlled open state
//     onOpenChange: (open: boolean) => void // Callback to update open state
// }

// export function HistorySheet({
//     roomId,
//     open,
//     onOpenChange,
// }: HistorySheetProps) {
//     const localStorageKey = `${roomId}.history`

//     const loadHistoryFromStorage = (): HistoryItemWithId[] => {
//         try {
//             const storedHistory = localStorage.getItem(localStorageKey)
//             console.log("stored", storedHistory)
//             if (storedHistory) {
//                 const parsedHistory: History[] = JSON.parse(storedHistory)
//                 // Add a temporary ID if your History type doesn't have one, for React keys
//                 // Assuming your History type has 'createdAt' as a Date object or ISO string
//                 console.log(parsedHistory)
//                 parsedHistory.forEach(h=>h.createdAt.ToDate)
//                 return parsedHistory.map((item, index) => ({
//                     ...item,
//                     id: `${item.username || "unknown"}-${item.createdAt?.toISOString() || index}`, // Create a unique ID
//                 }))
//             }
//         } catch (error) {
//             console.error("Failed to load history from localStorage:", error)
//         }
//         return []
//     }

//     const historyItems = loadHistoryFromStorage()

//     // Sort history by creation time (newest first, adjust if you want oldest first)
//     const sortedHistoryItems = historyItems.sort((a, b) => {
//         const timeA = new Date(a.createdAt).getTime()
//         const timeB = new Date(b.createdAt).getTime()
//         return timeB - timeA // Newest first
//     })

//     return (
//         <Sheet open={open} onOpenChange={onOpenChange}>
//             {" "}
//             {/* Controlled Sheet */}
//             {/* Note: No SheetTrigger here as it's triggered by the dropdown item */}
//             <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
//                 {" "}
//                 {/* Adjust width as needed */}
//                 <SheetHeader>
//                     <SheetTitle>Canvas History</SheetTitle>
//                     {/* <SheetDescription>
//                         Actions performed in room {roomId}
//                     </SheetDescription> */}
//                 </SheetHeader>
//                 <div className="grid gap-4 py-4">
//                     {sortedHistoryItems.length === 0 ? (
//                         <p className="text-center text-muted-foreground">
//                             No history found for this room.
//                         </p>
//                     ) : (
//                         sortedHistoryItems.map((item) => {
//                             const formattedTime = item.createdAt
//                                 ? formatHistoryDate(item.createdAt)
//                                 : "Unknown Time" // Fallback if createdAt is missing

//                             return (
//                                 <div
//                                     key={item.id} // Use the unique ID created earlier
//                                     className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0" // Add separator
//                                 >
//                                     <div className="flex items-start space-x-2">
//                                         <div className="rounded-full bg-gray-100 p-2">
//                                             <User className="h-4 w-4 text-gray-500" />
//                                         </div>
//                                         <div className="min-w-0 flex-1">
//                                             <p className="truncate text-sm font-medium">
//                                                 {item.username ||
//                                                     "Anonymous User"}{" "}
//                                                 {/* Handle potentially missing username */}
//                                             </p>
//                                             <div className="mt-1 flex items-center text-xs text-muted-foreground">
//                                                 <Clock className="mr-1 h-3 w-3" />
//                                                 <span>{formattedTime}</span>
//                                             </div>
//                                             <div className="mt-1 text-xs text-muted-foreground">
//                                                 Action: {item.mode}{" "}
//                                                 {/* Or any other relevant detail from item */}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )
//                         })
//                     )}
//                 </div>
//                 {/* <SheetFooter>
//                     <SheetClose asChild>
//                         <Button type="button" variant="secondary">
//                             Close
//                         </Button>
//                     </SheetClose>
//                 </SheetFooter> */}
//             </SheetContent>
//         </Sheet>
//     )
// }

// src/components/HistorySheet.tsx (or wherever you prefer)
import { Button } from "components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    // Note: We won't use SheetTrigger here anymore
} from "components/ui/sheet"
import { Calendar, User, Clock } from "lucide-react" // Or any other icons you prefer
import { formatHistoryDate } from "src/utils/utils"
import { canvasModeName, History } from "types/canvas" // Adjust import path if necessary

// Define a type for the history item *as stored in localStorage* (createdAt is a string)
type StoredHistoryItem = Omit<History, "createdAt"> & { createdAt: string } // createdAt is always a string when stored
type HistoryItemForDisplay = History // createdAt is Date when processed for display

type HistorySheetProps = {
    roomId: string // Pass the roomId to load the correct history
    open: boolean // Controlled open state
    onOpenChange: (open: boolean) => void // Callback to update open state
}

export function HistorySheet({
    roomId,
    open,
    onOpenChange,
}: HistorySheetProps) {
    const localStorageKey = `${roomId}.history`

    const loadHistoryFromStorage = (): HistoryItemForDisplay[] => {
        // Return type is now History (with Date)
        try {
            const storedHistory = localStorage.getItem(localStorageKey)
            if (storedHistory) {
                const parsedHistory: StoredHistoryItem[] =
                    JSON.parse(storedHistory) // Parse as objects with string createdAt
                // Convert the string createdAt back to Date object for display
                return parsedHistory.map((item) => ({
                    ...item,
                    createdAt: new Date(item.createdAt), // Convert string back to Date
                }))
            }
        } catch (error) {
            console.error("Failed to load history from localStorage:", error)
        }
        return []
    }

    const historyItems = loadHistoryFromStorage() // Now historyItems contains History objects with Date createdAt

    // Sort history by creation time (newest first, adjust if you want oldest first)
    const sortedHistoryItems = historyItems.sort((a, b) => {
        const timeA = a.createdAt.getTime() // Use getTime() on the Date object
        const timeB = b.createdAt.getTime() // Use getTime() on the Date object
        return timeB - timeA // Newest first
    })

    // Inside your HistorySheet component where you render the mode

    // // ... inside the map function
    // <div className="mt-1 text-xs text-muted-foreground">
    //     Action: {canvasModeNames[item.mode] || 'Unknown Mode'} {/* Fallback for safety */}
    // </div>

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {" "}
            {/* Controlled Sheet */}
            {/* Note: No SheetTrigger here as it's triggered by the dropdown item */}
            <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
                {" "}
                {/* Adjust width as needed */}
                <SheetHeader>
                    <SheetTitle>Canvas History</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    {sortedHistoryItems.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                            No history found for this room.
                        </p>
                    ) : (
                        sortedHistoryItems.map((item) => {
                            // item.createdAt is now a Date object, formatHistoryDate should handle Date or string
                            const formattedTime = item.createdAt
                                ? formatHistoryDate(item.createdAt)
                                : "Unknown Time" // Fallback if createdAt is missing

                            return (
                                <div
                                    key={`${item.username || "unknown"}-${item.createdAt?.toISOString() || Math.random()}`} // Recreate key using Date object
                                    className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0" // Add separator
                                >
                                    <div className="flex items-start space-x-2">
                                        <div className="rounded-full bg-gray-100 p-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {item.username ||
                                                    "Anonymous User"}{" "}
                                                {/* Handle potentially missing username */}
                                            </p>
                                            <div className="mt-1 flex items-center text-xs text-muted-foreground">
                                                <Clock className="mr-1 h-3 w-3" />
                                                <span>{formattedTime}</span>
                                            </div>
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                Action:{" "}
                                                {canvasModeName[item.mode]}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
