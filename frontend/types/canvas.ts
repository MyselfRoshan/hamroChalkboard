export enum CanvasMode {
    None,
    Move,
    Pan,
    Pencil,
    Line,
    Rect,
    Ellipse,
}

export const canvasModeName = Object.keys(CanvasMode).filter(k => typeof CanvasMode[k as any] === "number");
// export type CanvasMode = 'None' | "Move" | "Pan" | "Pencil" | "Line" | "Rect" | "Eillipse"

export type History = {
    mode: CanvasMode
    path: Point[]
    color: string
    stroke: number
    rdpEpsilon: number
    username?: string
    createdAt: Date
}

export type Point = [x: number, y: number]
export type CanvasSetting = {
    stroke: number
    color: string
    mode: CanvasMode
    rdpEpsilon: number

}
