import { Router } from "itty-router";
import { error, json, withContent } from "itty-router-extras";
import { handleOptions, corsWrapperAsync } from "./corsHelper";
import { getMatches } from "./helper";

const router = Router();

export interface Env {
  PRFX_KV: KVNamespace;
}

// TODO: add authentication for writes

router.get(
  "/prefix/:prefix",
  async ({ params }, env: Env, ctx: ExecutionContext) => {
    const prefix = params?.prefix;
    if (!prefix) {
      return error(400, "missing prefix");
    }

    const matches = await getMatches(prefix, env.PRFX_KV);

    // add cache-control headers so that the browser will cache the redirect for 10 minutes
    const target =
      matches.length === 1
        ? matches[0].value
        : `https://dashboard.prfx.kev3u.com/${prefix}`;
    return new Response(target, {
      status: 302,
      headers: {
        "Cache-Control": "max-age=600",
      },
    });
  }
);

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

    const matches = await getMatches(prefix, env.PRFX_KV);
    if (matches.length === 0) {
      return error(404, "no keys found");
    }
    if (matches.length === 1) {
      return json({
        data: matches[0],
      });
    }
    return json({
      data: {
        items: matches,
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
