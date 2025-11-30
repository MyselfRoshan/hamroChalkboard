import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from "react"
import { History } from "types/canvas"

// Helper function to load history from localStorage using roomId
const loadHistoryFromLocalStorage = (roomId: string): History[] => {
    const storedHistory = localStorage.getItem(`${roomId}.history`)
    return storedHistory ? JSON.parse(storedHistory) : []
}

// Helper function to save history to localStorage using roomId
const saveHistoryToLocalStorage = (roomId: string, history: History[]) => {
    localStorage.setItem(`${roomId}.history`, JSON.stringify(history))
}

// Helper function to delete history from localStorage using roomId
export const deleteHistoryFromLocalStorage = (roomId: string) => {
    localStorage.removeItem(`${roomId}.history`)
}

const useHistory = (roomId: string) => {
    const historyRef = useRef<History[]>(loadHistoryFromLocalStorage(roomId)) // Load history based on roomId
    const redoHistoryRef = useRef<History[]>([])

    const importHistory = useCallback(
        (newHistorys: History[]) => {
            historyRef.current.push(...newHistorys)
            saveHistoryToLocalStorage(roomId, historyRef.current) // Save to localStorage
        },
        [roomId],
    )

    const pushHistory = useCallback(
        (newHistory: History) => {
            historyRef.current.push(newHistory)
            redoHistoryRef.current = []
            saveHistoryToLocalStorage(roomId, historyRef.current) // Save to localStorage
        },
        [roomId],
    )

    const popHistory = useCallback(() => {
        if (historyRef.current.length === 0) return
        const poppedHistory = historyRef.current.pop()!
        redoHistoryRef.current.push(poppedHistory)
        saveHistoryToLocalStorage(roomId, historyRef.current) // Save to localStorage
    }, [roomId])

    const redoHistory = useCallback(() => {
        if (redoHistoryRef.current.length === 0) return
        const redoneHistory = redoHistoryRef.current.pop()!
        historyRef.current.push(redoneHistory)
        saveHistoryToLocalStorage(roomId, historyRef.current) // Save to localStorage
    }, [roomId])

    const clearAllHistory = useCallback(() => {
        historyRef.current = []
        redoHistoryRef.current = []
        deleteHistoryFromLocalStorage(roomId) // You already exported this
    }, [roomId])

    const getHistory = useCallback(() => historyRef.current, [])
    const getRedoHistory = useCallback(() => redoHistoryRef.current, [])

    // Sync with localStorage on mount to account for external changes
    useEffect(() => {
        saveHistoryToLocalStorage(roomId, historyRef.current)
    }, [roomId, historyRef.current]) // Only re-sync when `roomId` or `historyRef` changes

    return {
        importHistory,
        pushHistory,
        popHistory,
        redoHistory,
        clearAllHistory,
        getHistory,
        getRedoHistory,
    }
}

type HistoryContextType = ReturnType<typeof useHistory>

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

interface HistoryProviderProps {
    children: ReactNode
    roomId: string // Accept `roomId` as a prop
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({
    children,
    roomId,
}) => {
    const history = useHistory(roomId) // Initialize history with the specific roomId
    return (
        <HistoryContext.Provider value={history}>
            {children}
        </HistoryContext.Provider>
    )
}

export const useHistoryContext = (): HistoryContextType => {
    const context = useContext(HistoryContext)
    if (context === undefined) {
        throw new Error(
            "useHistoryContext must be used within a HistoryProvider",
        )
    }
    return context
}
