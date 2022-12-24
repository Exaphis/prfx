import { Router } from "itty-router";
import { error, json, withContent } from "itty-router-extras";
import { handleOptions, corsWrapperAsync } from "./corsHelper";

const router = Router();

export interface Env {
  PRFX_KV: KVNamespace;
}

// TODO: add authentication for writes

router.get(
  "/api",
  corsWrapperAsync(async (request, env: Env, ctx: ExecutionContext) => {
    const listResult = await env.PRFX_KV.list<{ value: string }>();
    return json({
      data: {
        items: listResult.keys.map((key) => ({
          key: key.name,
          value: key?.metadata?.value,
        })),
      },
    });
  })
);

router.get(
  "/api/:prefix",
  corsWrapperAsync(async ({ params }, env: Env, ctx: ExecutionContext) => {
    const prefix = params?.prefix;
    if (!prefix) {
      return error(400, "missing prefix");
    }

    // try to save a list operation if possible
    const value = await env.PRFX_KV.get(prefix);
    if (value) {
      return json({
        data: {
          key: prefix,
          value: value,
        },
      });
    }

    // otherwise, do a full list operation
    const listResult = await env.PRFX_KV.list<{ value: string }>({
      prefix: prefix,
    });
    if (listResult.keys.length === 0) {
      return error(404, "no keys found");
    }

    const items = listResult.keys.map((key) => ({
      key: key.name,
      value: key?.metadata?.value,
    }));

    if (items.length === 1) {
      return json({
        data: items[0],
      });
    }
    return json({
      data: {
        items,
      },
    });
  })
);

router.put(
  "/api/:key",
  withContent,
  corsWrapperAsync(async (request, env: Env, ctx: ExecutionContext) => {
    const key = request.params?.key;
    if (!key) {
      return error(400, "missing key");
    }

    const body = await request.json?.();
    const value = body?.value;
    if (!value) {
      return error(400, "malformed body or missing value");
    }

    await env.PRFX_KV.put(key, "", { metadata: { value: value } });
    return json({});
  })
);

router.delete(
  "/api/:key",
  corsWrapperAsync(async (request, env: Env, ctx: ExecutionContext) => {
    const key = request.params?.key;
    if (!key) {
      return error(400, "missing key");
    }

    await env.PRFX_KV.delete(key);
    return json({});
  })
);

router.options("*", handleOptions);

router.all("*", () => error(404, "not found"));

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return router.handle(request, env, ctx);
  },
};
