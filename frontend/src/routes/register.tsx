import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/register")({
    component: () => <Register />,
})

import { Button } from "components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "components/ui/card"
import { Checkbox } from "components/ui/checkbox"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { useState } from "react"

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-lg overflow-hidden shadow-xl">
                {/* Left side - Image */}
                <div className="w-full md:w-1/2 relative hidden md:block">
                    <img
                        // src="/placeholder.svg?height=600&width=600"
                        src="https://images.pexels.com/photos/3045825/pexels-photo-3045825.jpeg?auto=compress&cs=tinysrgb&w=448&h=706&dpr=1"
                        alt="Collaborative drawing"
                        className="w-full h-full object-cover"
                        width={448}
                        height={706}
                    />
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] grid place-items-center">
                        {/* <div className="absolute inset-0 bg-primary/20 flex items-center justify-center"> */}
                        {/* <ChalkboardIcon className="h-24 w-24 text-primary-foreground" /> */}
                    </div>
                </div>

                {/* Right side - Signup form */}
                <div className="w-full md:w-1/2 bg-card/30 backdrop-blur-md p-8 flex flex-col justify-center">
                    <Card className="border-none bg-transparent">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-primary">
                                Create an Account
                            </CardTitle>
                            <CardDescription>
                                Sign up to start collaborating on Hamro
                                Chalkboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@mail.com"
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="bg-background/50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className="bg-background/50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide confirm password"
                                                : "Show confirm password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-x-2">
                                <Checkbox id="remember" className="mt-1" />
                                <Label htmlFor="terms" className="text-sm">
                                    I agree to the{" "}
                                    <a
                                        href="#"
                                        className="text-primary hover:underline"
                                    >
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a
                                        href="#"
                                        className="text-primary hover:underline"
                                    >
                                        Privacy Policy
                                    </a>
                                </Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">
                                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                            </Button>
                        </CardFooter>
                    </Card>
                    <p className="text-center mt-4 text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-primary hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
