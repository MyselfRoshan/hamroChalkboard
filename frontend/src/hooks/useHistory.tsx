import { useCallback, useRef } from "react"
import { History } from "src/components/Canvas"

const useHistory = () => {
    const historyRef = useRef<History[]>([])
    const redoHistoryRef = useRef<History[]>([])

    const importHistory = useCallback((newHistorys: History[]) => {
        historyRef.current.push(...newHistorys)
    }, [])
    const pushHistory = useCallback((newHistory: History) => {
        historyRef.current.push(newHistory)
        redoHistoryRef.current = []
    }, [])

    const popHistory = useCallback(() => {
        if (historyRef.current.length === 0) return
        const poppedHistory = historyRef.current.pop()!
        redoHistoryRef.current.push(poppedHistory)
    }, [])

    const redoHistory = useCallback(() => {
        if (redoHistoryRef.current.length === 0) return
        const redoneHistory = redoHistoryRef.current.pop()!
        historyRef.current.push(redoneHistory)
    }, [])

    const getHistory = useCallback(() => historyRef.current, [])

    const getRedoHistory = useCallback(() => redoHistoryRef.current, [])

    return {
        importHistory,
        pushHistory,
        popHistory,
        redoHistory,
        getHistory,
        getRedoHistory,
    }
}

export default useHistory
