export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function timeAgo(dateStr: string) {
  const now = new Date().getTime();
  const date = new Date(dateStr).getTime();
  // console.log(now, date);

  const seconds = Math.floor((now - date) / 1000);
  let interval = Math.floor(seconds / 31536000); // seconds in a year

  if (interval > 1) return `${interval} years ago`;
  interval = Math.floor(seconds / 2592000); // seconds in a month
  if (interval > 1) return `${interval} months ago`;
  interval = Math.floor(seconds / 86400); // seconds in a day
  if (interval > 1) return `${interval} days ago`;
  interval = Math.floor(seconds / 3600); // seconds in an hour
  if (interval > 1) return `${interval} hours ago`;
  interval = Math.floor(seconds / 60); // seconds in a minute
  if (interval > 1) return `${interval} minutes ago`;
  return "just now";
}

export function throttle<F extends (...args: any[]) => void>(
  func: F,
  wait: number,
): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let lastExecuted = 0;

  return function (...args: Parameters<F>) {
    const now = Date.now();
    const remainingTime = wait - (now - lastExecuted);

    if (remainingTime <= 0 || remainingTime > wait) {
      if (timeout) {
        clearTimeout(timeout);
      }
      func(...args);
      lastExecuted = now;
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func(...args);
        lastExecuted = Date.now();
      }, remainingTime);
    }
  };
}
