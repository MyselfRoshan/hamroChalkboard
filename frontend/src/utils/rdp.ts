import { Point } from "types/canvas";

/**
 * Calculates the perpendicular distance from a point to a line segment.
 * @param p The point.
 * @param lineStart The starting point of the line segment.
 * @param lineEnd The ending point of the line segment.
 * @returns The perpendicular distance.
 */
function getPerpendicularDistance(p: Point, lineStart: Point, lineEnd: Point): number {
    // If the line segment is just a point, return the distance to that point.
    if (lineStart[0] === lineEnd[0] && lineStart[1] === lineEnd[1]) {
        return Math.sqrt(Math.pow(p[0] - lineStart[0], 2) + Math.pow(p[1] - lineStart[1], 2));
    }

    const dx = lineEnd[0] - lineStart[0];
    const dy = lineEnd[1] - lineStart[1];

    // Normalize the line segment vector
    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag === 0) {
        return 0; // Should not happen due to the first check, but for safety
    }
    const unitDx = dx / mag;
    const unitDy = dy / mag;

    // Vector from line start to point p
    const pvx = p[0] - lineStart[0];
    const pvy = p[1] - lineStart[1];

    // Project p onto the line segment
    let t = (pvx * unitDx + pvy * unitDy);
    t = Math.max(0, Math.min(mag, t)); // Clamp t to the line segment

    const closestPointOnLine: Point = [
        lineStart[0] + t * unitDx,
        lineStart[1] + t * unitDy,
    ];

    // Distance from p to the closest point on the line
    return Math.sqrt(Math.pow(p[0] - closestPointOnLine[0], 2) + Math.pow(p[1] - closestPointOnLine[1], 2));
}

/**
 * The Ramer-Douglas-Peucker algorithm for simplifying a curve represented by points.
 * @param points The array of points representing the curve.
 * @param epsilon The tolerance (maximum perpendicular distance).
 * @returns A new array of simplified points.
 */
export function rdp(points: Point[], epsilon: number): Point[] {
    if (points.length <= 2) {
        return points;
    }

    let dmax = 0;
    let index = 0;
    const end = points.length - 1;

    for (let i = 1; i < end; i++) {
        const d = getPerpendicularDistance(points[i], points[0], points[end]);
        if (d > dmax) {
            index = i;
            dmax = d;
        }
    }

    if (dmax > epsilon) {
        const recResults1 = rdp(points.slice(0, index + 1), epsilon);
        const recResults2 = rdp(points.slice(index, points.length), epsilon);

        // Build the result list, avoiding duplicating the pivot point
        const finalResults = recResults1.slice(0, recResults1.length - 1).concat(recResults2);
        return finalResults;
    } else {
        return [points[0], points[points.length - 1]];
    }
}
