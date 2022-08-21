import { Router } from "itty-router";
import { error, json, withContent } from "itty-router-extras";

const router = Router();

export interface Env {
  PRFX_KV: KVNamespace;
}

router.get("/:prefix", async ({ params }, env: Env, ctx: ExecutionContext) => {
  const prefix = params?.prefix;
  if (prefix === undefined) {
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
});

router.put(
  "/:key",
  withContent,
  async (request, env: Env, ctx: ExecutionContext) => {
    console.log(request);
    console.log(await request.json());
    // TODO: implement putting url
  }
);

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
