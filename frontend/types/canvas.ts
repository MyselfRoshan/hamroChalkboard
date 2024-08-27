// export type Color = string

// export type Camera = {
//     x: number
//     y: number
// }

// export type Layer =
//     | PathLayer
//     | TextLayer
//     | EllipseLayer
//     | RectangleLayer
//     | NoteLayer

// export enum LayerType {
//     Rectangle,
//     Ellipse,
//     Path,
//     Text,
//     Note,
// }

// export type RectangleLayer = {
//     type: LayerType.Rectangle
//     x: number
//     y: number
//     height: number
//     width: number
//     fill: Color
//     value?: string
// }
// export type EllipseLayer = {
//     type: LayerType.Ellipse
//     x: number
//     y: number
//     height: number
//     width: number
//     fill: Color
//     value?: string
// }

// export type PathLayer = {
//     type: LayerType.Path
//     x: number
//     y: number
//     height: number
//     width: number
//     fill: Color
//     size: number
//     points: number[][]
//     value?: string
// }

// export type TextLayer = {
//     type: LayerType.Text
//     x: number
//     y: number
//     height: number
//     width: number
//     fill: Color
//     value?: string
// }

// export type NoteLayer = {
//     type: LayerType.Note
//     x: number
//     y: number
//     height: number
//     width: number
//     fill: Color
//     value?: string
// }

// export type XYWH = {
//     x: number
//     y: number
//     width: number
//     height: number
// }

// export enum Side {
//     Top = 1,
//     Bottom = 2,
//     Left = 4,
//     Right = 8,
// }

// export type CanvasState =
//     | {
//           mode: CanvasMode.None
//       }
//     | {
//           mode: CanvasMode.Pressing
//           origin: Point
//       }
//     | {
//           mode: CanvasMode.SelectionNet
//           origin: Point
//           current?: Point
//       }
//     | {
//           mode: CanvasMode.Translating
//           current: Point
//       }
//     | {
//           mode: CanvasMode.Inserting
//           layerType:
//               | LayerType.Ellipse
//               | LayerType.Rectangle
//               | LayerType.Text
//               | LayerType.Note
//       }
//     | {
//           mode: CanvasMode.Resizing
//           initialBounds: XYWH
//           corner: Side
//       }
//     | {
//           mode: CanvasMode.Pencil
//       }
//     | {
//           mode: CanvasMode.Pan
//       }

// export enum CanvasMode {
//     None,
//     Pressing,
//     SelectionNet,
//     Translating,
//     Inserting,
//     Resizing,
//     Pencil,
//     Pan,
// }

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
    // color: Color
    color: string
    mode: CanvasMode
}
