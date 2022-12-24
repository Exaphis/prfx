import React from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "./Api";
import PrefixPage from "./Prefix";
import { ToastType, useToast } from "./ToastContext";

function Root() {
  const [url, setUrl] = React.useState("");
  const [key, setKey] = React.useState("");
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();

  if (searchParams.has("list")) {
    return <PrefixPage overridePrefix="" />;
  }

  function putKey() {
    fetcher(`/api/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value: url }),
    })
      .then(() => {
        addToast({
          message: "URL added successfully",
          type: ToastType.Success,
        });
      })
      .catch(() => {
        addToast({ message: "Failed adding URL", type: ToastType.Error });
      });
  }

  return (
    <div className="flex flex-col gap-5 w-full min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-7xl text-blue-700">prfx</h1>
        <h2 className="text-2xl">a prefix-based url shortener</h2>
      </div>
      <div className="card w-86 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Add or update a key</h2>
          <form
            className="form-control gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              putKey();
            }}
          >
            <label className="input-group">
              <span>Key</span>
              <input
                type="text"
                placeholder="example"
                className="input input-bordered"
                value={key}
                required
                onChange={(e) => setKey(e.target.value)}
              />
            </label>
            <label className="input-group">
              <span>URL</span>
              <input
                type="text"
                placeholder="https://example.com"
                className="input input-bordered"
                value={url}
                required
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
            <input type="submit" value="submit" className="btn btn-sm" />
          </form>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <a href="?list" className="text-center underline hover:text-blue-700">
          view all keys
        </a>{" "}
        <p className="text-center">
          visit{" "}
          <a href="/about" className="underline hover:text-blue-700">
            /about
          </a>{" "}
          to learn more
        </p>
      </div>
    </div>
  );
}

export default Root;
