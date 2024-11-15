import { Button } from "components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "components/ui/dialog"
import { Input } from "components/ui/input"
import { Copy, Share2 } from "lucide-react"
import QRCode from "react-qr-code"
import { toast } from "sonner"

type RoomShareProps = {
    roomId: string
    roomName: string
}
export default function RoomShare({ roomId, roomName }: RoomShareProps) {
    const shareLink = `${window.location.origin}/room/${roomId}`
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => {
                toast.success("Copied to clipboard!")
            },
            () => {
                toast.error("Failed to copy to clipboard")
            },
        )
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="bord">
                    <Share2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Share Room{" "}
                        <span className="text-white">"{roomName}"</span>
                    </DialogTitle>
                    <DialogDescription>
                        Share this link or QR code to invite others to the room.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                    <div className="rounded-lg bg-white p-4">
                        <QRCode value={shareLink} level="H" size={200} />
                    </div>
                    <Input value={shareLink} readOnly className="w-full" />
                    <Button
                        onClick={() => copyToClipboard(shareLink)}
                        className="w-full"
                    >
                        <Copy className="mr-2 h-4 w-4" /> Copy Link
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
