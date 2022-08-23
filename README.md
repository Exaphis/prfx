# prfx

[![Netlify Status](https://api.netlify.com/api/v1/badges/73e15a16-8cfb-43c6-b140-5fccc6c24471/deploy-status)](https://app.netlify.com/sites/visionary-kringle-1257ca/deploys)

## What is prfx?

prfx is a URL shortener that allows you to map keys to URLs.
You can reach the URL via any prefix of the key. If there are
multiple keys for a given prefix, a list is shown instead.

prfx's frontend is deployed with Netlify and its backend is deployed with
Cloudflare Workers.

## Development

To run the worker, update `worker/wrangler.toml` with your own Cloudflare
KV namespace.

```console
cd worker
npm start
```

To run the frontend:

```console
cd frontend
npm start
```

## Usage

Visit [https://prfx.kev3u.com](https://prfx.kev3u.com).
