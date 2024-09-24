import { createFileRoute, redirect } from "@tanstack/react-router"

import { Button } from "components/ui/button"
import { LogIn } from "lucide-react"
import { useAuth } from "src/auth"
import Logout from "src/components/Logout"
export const Route = createFileRoute("/(auth)/dashboard")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const auth = useAuth()
  // console.log(auth.user)
  return (
    <section className="grid gap-2 p-2">
      <p>Hi {auth.user?.username}!</p>
      <p>You are currently on the dashboard route.</p>
      <Logout />
      <Button
        className="w-full"
        type="button"
        onClick={(e) => {
          e.preventDefault()
          // console.log(localStorage.getItem("auth.user"))
          auth.fetch("http://localhost:3333/authenticated", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth.user")}`,
            },
          })
            .then((response) => {

              // console.log(response)
              // console.log(response.json())
              return response.json()
              // return response.json(); // or response.text() depending on your expected response
            })
            .then((data) => {
              console.log(data)
              // console.log(new Date(data.exp))
            })
            .catch((error) => {
              console.error(
                "There was a problem with the fetch operation:",
                error,
              )
            })
        }}
      >
        <LogIn className="mr-2 h-4 w-4" /> Hit restricted api
      </Button>
    </section>
  )
}
