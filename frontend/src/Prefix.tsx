import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "./Api";

function EmptyPrefix(params: { prefix: string }) {
  const { prefix } = params;
  return <p>empty prefix /{prefix}.</p>;
}

function Prefix() {
  const { prefix } = useParams();
  const { data, error } = useSWR(`/${prefix}`, fetcher);

  console.log(data, error);

  if (!prefix) return <p>empty prefix</p>;
  if (error) return <p>failed to load</p>;
  if (!data) return <progress className="progress w-56" />;

  if (data.status === 404) {
    return <EmptyPrefix prefix={prefix} />;
  }

  return <p>{prefix}</p>;
}

export default Prefix;
