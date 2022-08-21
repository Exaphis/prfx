import { useParams } from "react-router-dom";
import useSWR from "swr";

const BASE_URL = "http://localhost:8787"

// https://stackoverflow.com/a/63024984/6686559
type Rest<T extends any[]> = 
  ((...p: T) => void) extends ((p1: infer P1, ...rest: infer R) => void) ? R : never;

function fetchAbsolute(url: string, ...args: Rest<Parameters<typeof fetch>>) {
  return url.startsWith('/') ? fetch(BASE_URL + url, ...args) : fetch(url, ...args)
}

const fetcher = (...args: Parameters<typeof fetchAbsolute>) => fetchAbsolute(...args).then(res => res.json())

function Prefix() {
  const { prefix } = useParams();
  const { data, error } = useSWR(`/${prefix}`, fetcher);

  console.log(data, error)

  if (!prefix) return null;
  return (
    <p>{prefix}</p>
  )
}

export default Prefix;