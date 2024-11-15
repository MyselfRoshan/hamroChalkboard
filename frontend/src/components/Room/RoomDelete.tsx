import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Button } from "components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "components/ui/dialog"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "src/auth"
import { deleteHistoryFromLocalStorage } from "src/hooks/useHistory"
import { ROOM_URL } from "src/utils/constants"

type RoomDeleteProps = {
    roomId: string
    roomName: string
}

export default function RoomDelete({ roomId, roomName }: RoomDeleteProps) {
    const { authFetch } = useAuth()
    const router = useRouter()
    const queryClient = useQueryClient()
    const { mutateAsync } = useMutation({
        mutationFn: async () => {
            return authFetch(`${ROOM_URL}/${roomId}`, {
                method: "DELETE",
            })
        },
        onSuccess: async (data) => {
            if (data.status === 200) {
                const { message } = await data.json()
                toast.success(`Room '${roomName}' deleted successfully`)
                deleteHistoryFromLocalStorage(roomId)
                queryClient.invalidateQueries({ queryKey: ["rooms"] })
                router.invalidate()
            }
        },
        onError: (error) => {
            console.error(error)
            toast.error("Failed to delete room")
        },
    })

    const handleDelete = async () => {
        try {
            await mutateAsync()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete room")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructiveHover" size="sm">
                    <Trash className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Room</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this room? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
