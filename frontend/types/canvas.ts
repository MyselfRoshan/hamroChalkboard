export enum CanvasMode {
    None,
    Move,
    Pan,
    Pencil,
    Line,
    Rect,
    Ellipse,
}

export type History = {
    mode: CanvasMode
    path: Point[]
    color: string
    stroke: number
}
export type Point = [x: number, y: number]
export type CanvasSetting = {
    stroke: number
    color: string
    mode: CanvasMode
}
