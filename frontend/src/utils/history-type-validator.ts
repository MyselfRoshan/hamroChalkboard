import { CanvasMode, Point } from "types/canvas"

function isPoint(data: any): data is Point {
    return (
        Array.isArray(data) &&
        data.length === 2 &&
        typeof data[0] === "number" &&
        typeof data[1] === "number"
    )
}

function isHistory(data: any): data is History {
    return (
        typeof data.mode === "number" &&
        Object.values(CanvasMode).includes(data.mode) &&
        Array.isArray(data.path) &&
        data.path.every(isPoint) &&
        typeof data.color === "string" &&
        typeof data.stroke === "number"
    )
}

export function validateHistoryArray(data: any): data is History[] {
    return Array.isArray(data) && data.every(isHistory)
}
