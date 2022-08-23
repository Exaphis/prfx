import React from "react";
import { fetcher } from "./Api";
import { ToastType, useToast } from "./ToastContext";

function Root() {
  const [url, setUrl] = React.useState("");
  const [key, setKey] = React.useState("");
  const { addToast } = useToast();

  function putKey() {
    fetcher(`/${key}`, {
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

  // TODO: add form validation
  return (
    <div className="flex flex-col gap-5 w-full h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-7xl text-blue-700">prfx</h1>
        <h2 className="text-2xl">a prefix-based url shortener</h2>
      </div>
      <div className="card w-86 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Add a new URL</h2>
          <div className="form-control gap-2">
            <label className="input-group">
              <span>URL</span>
              <input
                type="text"
                placeholder="https://example.com"
                className="input input-bordered"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
            <label className="input-group">
              <span>Key</span>
              <input
                type="text"
                placeholder="example"
                className="input input-bordered"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </label>
          </div>
          <input type="submit" className="btn btn-sm" onClick={putKey} />
        </div>
      </div>
      <p>
        visit{" "}
        <a href="/about" className="underline hover:text-blue-700">
          /about
        </a>{" "}
        to learn more
      </p>
    </div>
  );
}

export default Root;
