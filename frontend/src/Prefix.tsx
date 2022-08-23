import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "./Api";

function EmptyPrefix(params: { prefix: string }) {
  const { prefix } = params;
  return (
    <>
      <h2 className="text-center text-4xl">
        No items for prefix <span className="text-blue-700">{prefix}</span>.
      </h2>
      <a href="/" className="underline hover:text-blue-700">
        Back to home
      </a>
    </>
  );
}

function MultiplePrefix(params: { prefixes: string[] }) {
  const { prefixes } = params;
  return (
    <>
      <h2 className="text-center text-4xl">Multiple prefixes found</h2>
      <div className="card shadow-xl">
        <table className="table">
          <thead>
            <tr>
              <th>Prefix</th>
            </tr>
          </thead>
          <tbody>
            {prefixes.map((prefix) => (
              <tr key={prefix}>
                <td>
                  <a
                    href={`/${prefix}`}
                    className="underline hover:text-blue-700"
                  >
                    {prefix}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a href="/" className="underline hover:text-blue-700">
        Back to home
      </a>
    </>
  );
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
  if (data.data.items) {
    return <MultiplePrefix prefixes={data.data.items} />;
  }
  const url = data.data.value;
  if (url) {
    window.location.replace(url);
    // users will stay on this window until the target page loads
    return (
      <>
        <p>
          Redirecting to{" "}
          <a href={url} className="underline hover:text-blue-700">
            {url}
          </a>
        </p>
        <progress className="progress w-56" />
      </>
    );
  }

  return <p>unknown response</p>;
}

function PrefixPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
      <Prefix />
    </div>
  );
}

export default PrefixPage;
