import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import { LucideIcon, Pencil, Share2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "src/components/Header";

export const Route = createLazyFileRoute("/")({
  component: () => <LandingPage />,
});

function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              Hamro Chalkboard brings your team's ideas to life with real-time
              collaborative drawing.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="mr-4 bg-yellow-500 text-white hover:bg-yellow-700"
              >
                Get Started
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
              backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
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
                description="Share your creations with a single click, or export in various formats."
              />
            </div>
          </div>
        </section>

        {/* <section className="relative py-24">
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage:
                                "url('/placeholder.svg?height=1080&width=1920')",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            transform: `translateY(${(scrollY - 1000) * 0.3}px)`,
                            opacity: 0.1,
                        }}
                    />
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h3 className="text-3xl font-bold mb-6 text-yellow-800">
                            Ready to boost your team's creativity?
                        </h3>
                        <p className="text-xl text-gray-600 mb-8">
                            Join thousands of teams already using Hamro
                            Chalkboard
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Input
                                placeholder="Enter your email"
                                className="max-w-xs bg-white/50 backdrop-blur-sm"
                            />
                            <Button className="bg-pr hover:bg-yellow-700 text-white">
                                Sign Up Free
                            </Button>
                        </div>
                    </div>
                </section> */}
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
            <p>&copy; 2023 Hamro Chalkboard. All rights reserved.</p>
            <nav>
              <ul className="mt-4 flex space-x-4 md:mt-0">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-yellow-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-yellow-300"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-yellow-300"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-yellow-100 bg-white/30 p-6 text-center shadow-md backdrop-blur-md transition-shadow hover:shadow-lg">
      <div className="mb-4 flex justify-center">
        <Icon className="text-yellow-bg-yellow-500 h-12 w-12" />
      </div>
      <h4 className="mb-2 text-xl font-semibold text-yellow-800">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
