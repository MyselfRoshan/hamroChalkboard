import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type React from "react"
import { useEffect, useRef } from "react"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
    const innerRef = useRef<T>(null)

    useEffect(() => {
        if (!ref) return
        if (typeof ref === "function") {
            ref(innerRef.current)
        } else {
            ref.current = innerRef.current
        }
    })

    return innerRef
}
