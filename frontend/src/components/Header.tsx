import { Link } from "@tanstack/react-router"
import React from "react"

export default function Header() {

    return (
        <header>
            <nav className="p-2 flex gap-2">
                <Link to="/" className="[&.active]:font-bold">
                    Home
                </Link>
                {/* <Link to="/about" className="[&.active]:font-bold">
                    About
                </Link> */}
            </nav>

            <hr />
        </header>
    )
}
