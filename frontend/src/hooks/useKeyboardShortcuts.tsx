// useKeyboardShortcuts.ts
import { useEffect, useRef } from "react"

type ShortcutCallback = (event: KeyboardEvent) => void

interface Shortcuts {
    [keyCombination: string]: ShortcutCallback
}

// Keeps track of all active shortcuts
const activeShortcuts = new Map<string, ShortcutCallback>()

const useKeyboardShortcuts = (shortcuts: Shortcuts) => {
    const prevShortcutsRef = useRef<Shortcuts>(shortcuts)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            for (const [keyCombination, callback] of Object.entries(
                shortcuts,
            )) {
                const [key, modifiers] = keyCombination.split("+")
                const isKeyMatch = event.key.toLowerCase() === key.toLowerCase()
                const areModifiersMatch = (modifiers || "")
                    .split(",")
                    .every(modifier => {
                        switch (modifier.trim()) {
                            case "ctrl":
                                return event.ctrlKey
                            case "shift":
                                return event.shiftKey
                            case "alt":
                                return event.altKey
                            case "meta":
                                return event.metaKey
                            default:
                                return false
                        }
                    })
                if (isKeyMatch && areModifiersMatch) {
                    console.log(
                        "Matched shortcut:",
                        keyCombination,
                        callback(event),
                    )
                    event.preventDefault()
                    callback(event)
                }
            }
        }

        // Register shortcuts
        Object.entries(shortcuts).forEach(([keyCombination, callback]) => {
            activeShortcuts.set(keyCombination, callback)
        })

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            // Unregister shortcuts
            Object.keys(shortcuts).forEach(keyCombination => {
                activeShortcuts.delete(keyCombination)
            })
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [shortcuts])

    useEffect(() => {
        // Update the previous shortcuts ref
        prevShortcutsRef.current = shortcuts
    }, [shortcuts])
}

export default useKeyboardShortcuts
