import { useParams } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "./Api";
import { ToastType, useToast } from "./ToastContext";

type KVPair = {
  key: string;
  value: string;
};

function EmptyPrefix(params: { prefix: string }) {
  const { prefix } = params;
  return (
    <>
      <h2 className="text-center text-4xl">
        {prefix ? (
          <>
            No items for prefix <span className="text-blue-700">{prefix}</span>
          </>
        ) : (
          <>No keys found.</>
        )}
      </h2>
      <a href="/" className="underline hover:text-blue-700">
        Back to home
      </a>
    </>
  );
}

function MultiplePrefix(params: { pairs: KVPair[] }) {
  const { pairs } = params;
  const { addToast } = useToast();
  const { mutate } = useSWRConfig();

  if (pairs.length === 0) {
    return <EmptyPrefix prefix="" />;
  }

  function deleteKey(key: string) {
    fetcher(`/api/${key}`, {
      method: "DELETE",
    })
      .then(() => {
        addToast({
          message: "Key deleted successfully",
          type: ToastType.Success,
        });

        // mutate all prefixes of the key
        for (var l = 0; l <= key.length; l++) {
          mutate(`/api/${key.substring(0, l)}`);
        }
      })
      .catch(() => {
        addToast({ message: "Failed deleting key", type: ToastType.Error });
      });
  }

  return (
    <>
      <h2 className="text-center text-4xl">Multiple prefixes found</h2>
      <div className="card shadow-xl">
        <table className="table">
          <thead>
            <tr>
              <th>Key</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair) => (
              <tr key={pair.key}>
                <td>
                  <a
                    href={`/${pair.key}`}
                    className="underline hover:text-blue-700"
                  >
                    {pair.key}
                  </a>
                </td>
                <td>
                  <a
                    href={`//${pair.value}`}
                    className="underline hover:text-blue-700"
                  >
                    {pair.value}
                  </a>
                </td>
                <td>
                  <button
                    className="btn btn-sm"
                    onClick={() => deleteKey(pair.key)}
                  >
                    Delete
                  </button>
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

function Prefix({ prefix }: { prefix?: string }) {
  const { data, error } = useSWR(`/api/${prefix}`, fetcher);

  if (prefix === undefined) return <p>empty prefix</p>;
  if (error) return <p>failed to load</p>;
  if (!data) return <progress className="progress w-56" />;

  if (data.status === 404) {
    return <EmptyPrefix prefix={prefix} />;
  }
  if (data.data.items) {
    return <MultiplePrefix pairs={data.data.items} />;
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

function PrefixPage({ overridePrefix }: { overridePrefix?: string }) {
  const { prefix } = useParams();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
      <Prefix prefix={overridePrefix !== undefined ? overridePrefix : prefix} />
    </div>
  );
}

export default PrefixPage;
