import { Router } from "itty-router";
import { error, json, withContent } from "itty-router-extras";
import { handleOptions, corsWrapperAsync } from "./corsHelper";

const router = Router();

export interface Env {
  PRFX_KV: KVNamespace;
}

router.get(
  "/",
  corsWrapperAsync(async (request, env: Env, ctx: ExecutionContext) => {
    const listResult = await env.PRFX_KV.list<string>();
    return json({
      data: {
        items: listResult.keys.map((key) => key.name),
      },
    });
  })
);

router.get(
  "/:prefix",
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
    const listResult = await env.PRFX_KV.list<string>({ prefix: prefix });
    if (listResult.keys.length === 0) {
      return error(404, "no keys found");
    }

    if (listResult.keys.length === 1) {
      return json({
        data: {
          key: listResult.keys[0].name,
          value: await env.PRFX_KV.get(listResult.keys[0].name),
        },
      });
    }
    return json({
      data: {
        items: listResult.keys.map((key) => key.name),
      },
    });
  })
);

router.put(
  "/:key",
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

    await env.PRFX_KV.put(key, value);
    return json({});
  })
);

router.delete(
  "/:key",
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
