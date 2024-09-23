import { Link, useRouter } from '@tanstack/react-router'
import { useAuth } from 'src/auth'
import { Route } from 'src/routes/__root'

export default function Logout() {
    const { logout } = useAuth()
    const router = useRouter()
    const navigate = Route.useNavigate()
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout().then(() => {
                router.invalidate().finally(() => {
                    navigate({ to: '/' })
                })
            })
        }
    }
    return (
        <Link
            onClick={handleLogout}
            to="/register"
            className="mr-4 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md bg-yellow-500 px-8 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
            Logout
        </Link>
    )
}
