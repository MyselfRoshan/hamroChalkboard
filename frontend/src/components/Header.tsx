import { Link } from "@tanstack/react-router"

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-yellow-50/30 border-b border-yellow-100">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-primary">
                        Hamro Chalkboard
                    </h1>
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link
                                to="/features"
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                Login
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
