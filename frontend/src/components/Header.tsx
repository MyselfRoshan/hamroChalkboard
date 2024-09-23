import { Link } from "@tanstack/react-router"
import { useAuth } from "src/auth"
import Logout from "./Logout"

export default function Header() {
  const { isAuthenticated } = useAuth()
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-yellow-100 bg-yellow-50/30 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-primary">Hamro Chalkboard</h1>
        </Link>
        <nav>
          <ul className="flex items-center justify-center space-x-4">
            <li>
              <Link
                to="/features"
                className="text-gray-600 transition-colors hover:text-primary"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-600 transition-colors hover:text-primary"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-600 transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </li>
            <li>
              {
                isAuthenticated ?
                  <Logout /> : <Link
                    to="/login"
                    className="mr-4 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md bg-yellow-500 px-8 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Log in
                  </Link>
              }
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
