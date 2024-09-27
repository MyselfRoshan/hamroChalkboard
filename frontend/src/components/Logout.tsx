import { useRouter } from '@tanstack/react-router'
import { useAuth } from 'src/auth'
import { Route } from 'src/routes/__root'

import { useMutation } from '@tanstack/react-query'
import { Button } from "components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "components/ui/dialog"
import { toast } from 'sonner'

export default function Logout() {
    const { logout, user } = useAuth()
    const router = useRouter()
    const navigate = Route.useNavigate()
    const mutate = useMutation({
        mutationFn: async () => {
            return fetch("http://localhost:3333/logout", {
                method: "DELETE",
                body: user?.username
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
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" className='mr-4 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md bg-yellow-500 px-8 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                        {/* <Button variant="destructive" > */}
                        Logout
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to logout?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className='hover:bg-white bg-transparent text-white'>No</Button>
                        <Button type="submit" variant="destructive" className='hover:bg-red-600' onClick={handleLogout}>Yes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    )
}
