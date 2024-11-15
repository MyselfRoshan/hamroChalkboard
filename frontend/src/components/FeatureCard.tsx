import { LucideIcon } from "lucide-react"

export type FeatureCardProps = {
    icon: LucideIcon
    title: string
    description: string
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
}: FeatureCardProps) {
    return (
        <div className="rounded-lg border border-yellow-100 bg-white/30 p-6 text-center shadow-md backdrop-blur-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex justify-center">
                <Icon className="text-yellow-bg-yellow-500 h-12 w-12" />
            </div>
            <h4 className="mb-2 text-xl font-semibold text-yellow-800">
                {title}
            </h4>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}
