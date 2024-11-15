import { createLazyFileRoute, Link } from "@tanstack/react-router"
import { Button } from "components/ui/button"
import { Pencil, Share2, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "src/auth"
import { FeatureCard } from "src/components/FeatureCard"
import Header from "src/components/Header"

export const Route = createLazyFileRoute("/")({
    component: () => <LandingPage />,
})

function LandingPage() {
    const [scrollY, setScrollY] = useState(0)
    const { isAuthenticated } = useAuth()
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll)
        3
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-b from-yellow-50 to-white text-gray-800">
            <Header />

            <main>
                <section className="relative flex h-screen items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?q=80&w=984&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                            backgroundPosition: "center",
                            filter: "saturation(1.5) hue-rotate(20deg)",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            backgroundSize: "cover",
                            transform: `translateY(${scrollY * 0.5}px)`,
                        }}
                    />
                    <div className="relative z-10 w-full bg-white/50 px-4 py-32 text-center backdrop-blur-sm">
                        <h2 className="mb-6 text-5xl font-bold text-yellow-800">
                            Collaborate and Create Together
                        </h2>
                        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-700">
                            Hamro Chalkboard brings your team's ideas to life
                            with real-time collaborative drawing.
                        </p>
                        <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                            <Button
                                size="lg"
                                className="mr-4 bg-yellow-500 text-white hover:bg-yellow-700"
                            >
                                {isAuthenticated
                                    ? "Go to Dashboard"
                                    : "Get Started"}
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-yellow-bg-yellow-500 text-yellow-bg-yellow-500 hover:bg-yellow-50"
                        >
                            Learn More
                        </Button>
                    </div>
                </section>

                <section id="features" className="relative py-24">
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage:
                                "url('/placeholder.svg?height=1080&width=1920')",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            transform: `translateY(${(scrollY - 500) * 0.2}px)`,
                            opacity: 0.1,
                        }}
                    />
                    <div className="container relative z-10 mx-auto px-4">
                        <h3 className="mb-12 text-center text-3xl font-bold text-yellow-800">
                            Features
                        </h3>
                        <div className="grid gap-8 md:grid-cols-3">
                            <FeatureCard
                                icon={Pencil}
                                title="Intuitive Drawing Tools"
                                description="Easily sketch, draw, and annotate with our user-friendly interface."
                            />
                            <FeatureCard
                                icon={Users}
                                title="Real-time Collaboration"
                                description="Work together in real-time, no matter where your team is located."
                            />
                            <FeatureCard
                                icon={Share2}
                                title="Easy Sharing"
                                description="Share your creations with a single click, or export in .chalkboard format."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-yellow-800 py-8 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <div className="mb-4 flex items-center space-x-2 md:mb-0">
                            {/* <ChalkboardIcon className="h-6 w-6 text-yellow-300" /> */}
                            <span className="font-semibold text-yellow-300">
                                Hamro Chalkboard
                            </span>
                        </div>
                        <p>
                            &copy; 2023 Hamro Chalkboard. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
