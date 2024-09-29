import { useRouter } from '@tanstack/react-router'
import { useAuth } from 'src/auth'
import { Route } from 'src/routes/__root'

import { useMutation } from '@tanstack/react-query'
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
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { DEAUTH_URL } from 'src/utils/constants'

type LogoutProps = {
    as?: "default" | "menu-item"
}
export default function Logout({ as = "default" }: LogoutProps) {
    const { logout, token } = useAuth()
    const router = useRouter()
    const navigate = Route.useNavigate()
    const mutate = useMutation({
        mutationFn: async () => {
            return fetch(DEAUTH_URL, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        },
        onSuccess: async (data) => {
            if (data.status === 200) {
                toast.success((await data.json()).message)
                logout().then(() => {
                    router.invalidate().finally(() => {
                        navigate({ to: '/' })
                    })
                })

            }
        }
    })
    const handleLogout = async () => {
        try {
            await mutate.mutateAsync()

        } catch (error: any) {
            console.log(error)
        }
    }
    // mutate.isPending ? toast.info("Logging out...") : null
    return (
        <Dialog>
            <DialogTrigger asChild>
                {as === "menu-item" ? (
                    <Button variant="dropdown-menu"
                        size="auto"
                    >
                        <LogOut className='mr-2 h-4 w-4' />
                        Logout
                    </Button>
                ) :
                    <Button
                        // className='bg-yellow-500 text-white hover:bg-yellow-700'
                        size="lg"
                        variant="default"
                    >
                        Logout
                    </Button>

                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Logout</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to logout?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className='hover:bg-white bg-transparent text-white'>No</Button>
                    </DialogClose>
                    <Button type="submit" variant="destructive" className='hover:bg-red-600' onClick={handleLogout}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}
