const BASE_URL = process.env.REACT_APP_API_ENDPOINT;

// https://stackoverflow.com/a/63024984/6686559
type Rest<T extends any[]> = ((...p: T) => void) extends (
  p1: infer P1,
  ...rest: infer R
) => void
  ? R
  : never;

function fetchAbsolute(url: string, ...args: Rest<Parameters<typeof fetch>>) {
  return url.startsWith("/")
    ? fetch(BASE_URL + url, ...args)
    : fetch(url, ...args);
}

export const fetcher = (...args: Parameters<typeof fetchAbsolute>) =>
  fetchAbsolute(...args).then((res) => res.json());
