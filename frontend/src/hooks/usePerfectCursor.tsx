import { PerfectCursor } from "perfect-cursors";
import { useCallback, useLayoutEffect, useState } from "react";
import { Cursor } from "src/components/Cursor";

export function usePerfectCursor(
  cb: (point: number[]) => void,
  point?: number[],
) {
  const [pc] = useState(() => new PerfectCursor(cb));

  useLayoutEffect(() => {
    if (point) pc.addPoint(point);
    return () => pc.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pc]);

  const onPointChange = useCallback(
    (point: number[]) => pc.addPoint(point),
    [pc],
  );

  return onPointChange;
}

export function renderCursors(users: any, usernameToCheck: string | undefined) {
  return Object.keys(users).map((username) => {
    // console.log(users);
    if (usernameToCheck !== username && users[username].cursor) {
      return (
        <Cursor
          key={username}
          username={username}
          point={[users[username].cursor.x, users[username].cursor.y]}
        />
      );
    }
  });
}
