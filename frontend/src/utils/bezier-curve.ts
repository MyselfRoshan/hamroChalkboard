import { Point } from "src/components/Canvas"

// Utility functions for Bézier curves
function bernsteinPolynomial(t: number, n: number, i: number): number {
    function factorial(num: number): number {
        return num <= 1 ? 1 : num * factorial(num - 1)
    }

    return (
        (factorial(n) / (factorial(i) * factorial(n - i))) *
        Math.pow(t, i) *
        Math.pow(1 - t, n - i)
    )
}

function bezierPoint(
    t: number,
    controlPoints: [number, number][],
): [number, number] {
    const n = controlPoints.length - 1
    let x = 0
    let y = 0

    for (let i = 0; i <= n; i++) {
        const b = bernsteinPolynomial(t, n, i)
        x += b * controlPoints[i][0]
        y += b * controlPoints[i][1]
    }

    return [x, y]
}

export function generateSmoothPath(
    points: Point[],
    numSegments: number = 10,
): Point[] {
    const smoothPath: Point[] = []

    for (let i = 0; i < points.length - 1; i++) {
        // Generate control points for a quadratic Bézier curve
        const p0 = points[i]
        const p1 = points[i + 1]
        const controlPoint: Point = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2]

        // Generate points along the Bézier curve
        for (let t = 0; t <= 1; t += 1 / numSegments) {
            const [x, y] = bezierPoint(t, [p0, controlPoint, p1])
            smoothPath.push([x, y])
        }
    }

    return smoothPath
}

export function bzCurve(
    ctx: CanvasRenderingContext2D,
    points: Point[],
    f: number = 0.3,
    t: number = 0.6,
) {
    //f = 0, will be straight line
    //t suppose to be 1, but changing the value can control the smoothness too

    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])

    let m = 0
    let dx1 = 0
    let dy1 = 0
    let dy2
    let dx2

    var preP = points[0]
    for (let i = 1; i < points.length; i++) {
        let curP = points[i]
        let nexP = points[i + 1]
        if (nexP) {
            m = gradient(preP, nexP)
            dx2 = (nexP[0] - curP[0]) * -f
            dy2 = dx2 * m * t
        } else {
            dx2 = 0
            dy2 = 0
        }
        ctx.bezierCurveTo(
            preP[0] - dx1,
            preP[1] - dy1,
            curP[0] + dx2,
            curP[1] + dy2,
            curP[0],
            curP[1],
        )
        dx1 = dx2
        dy1 = dy2
        preP = curP
    }
    ctx.stroke()
}

function gradient(a: Point, b: Point) {
    return (b[1] - a[1]) / (b[0] - a[0])
}
export const lines = () => {
    // Generate random data
    let X = 10
    let t = 40 //to control width of X
    const points: Point[] = []
    for (var i = 0; i < 100; i++) {
        const Y = Math.floor(Math.random() * 3000 + 50)
        const p: Point = [X, Y]
        points.push(p)
        X = X + t
    }
    return points
}
export function addPoint(path: Point[], point: Point | null): Point[] {
    if (!point) return path
    const [x, y] = point
    if (path.length > 0) {
        const lastPoint = path[path.length - 1]
        const distance = Math.sqrt(
            (x - lastPoint[0]) ** 2 + (y - lastPoint[1]) ** 2,
        )

        // Add point only if it's farther than the threshold
        if (distance > 5) path.push([x, y])
    } else {
        path.push([x, y])
    }
    return path
}
//draw straight line
// ctx.beginPath()
// ctx.setLineDash([5])
// ctx.lineWidth = 1
// bzCurve(lines, 0, 1)

// //draw smooth line
// ctx.setLineDash([0])
// ctx.lineWidth = 2
// ctx.strokeStyle = "blue"
// bzCurve(lines, 0.3, 1)
