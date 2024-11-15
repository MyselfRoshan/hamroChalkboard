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
import { Input } from "components/ui/input"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "src/auth"
import { ROOM_URL } from "src/utils/constants"

type ActionHandlerProps = {
    roomId: string
    roomName: string
    newRoomName: string
    setNewRoomName: React.Dispatch<React.SetStateAction<string>>
}

export default function RoomUpdate({
    roomId,
    roomName,
    newRoomName,
    setNewRoomName,
}: ActionHandlerProps) {
    const { authFetch } = useAuth()
    const router = useRouter()
    const queryClient = useQueryClient()

    const updateMutation = useMutation({
        mutationFn: async (data: FormData) => {
            return await authFetch(`${ROOM_URL}/${roomId}`, {
                method: "PATCH",
                body: data,
            })
        },
        onSuccess: async (data) => {
            if (data.status === 200) {
                const { message, name } = await data.json()
                toast.success(
                    `Room name updated from '${roomName}' to '${name}' successfully`,
                )
                queryClient.invalidateQueries({ queryKey: ["rooms"] })
                router.invalidate()
            }
        },
        onError: (error) => {
            // console.error(error);
            toast.error("Failed to update room name")
        },
    })

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        console.log(formData.get("new_name"), roomName)
        try {
            // console.log(formData);
            await updateMutation.mutateAsync(formData)
        } catch (error) {
            // console.error(error);
            toast.error("Failed to update room name")
        }
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewRoomName(e.target.value)
    }
    // console.log(newRoomName, roomName);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Room Name</DialogTitle>
                    <DialogDescription>
                        Enter a new name for the room.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdate}>
                    <Input
                        value={newRoomName}
                        onChange={handleOnChange}
                        name="new_name"
                        className="mt-4"
                    />
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            disabled={
                                newRoomName === "" || newRoomName === roomName
                            }
                        >
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
