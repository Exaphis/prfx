import { RouteHandler, Request as IttyRequest } from "itty-router";

// https://developers.cloudflare.com/workers/examples/cors-header-proxy/
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,PUT,DELETE,OPTIONS",
  "Access-Control-Max-Age": "86400",
  // Allow all future content Request headers to go back to browser
  // such as Authorization (Bearer) or X-Client-Name-Version
  "Access-Control-Allow-Headers": "*",
};

export function handleOptions(request: Request) {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: corsHeaders["Access-Control-Allow-Methods"],
      },
    });
  }
}

export function corsWrapperAsync(fun: RouteHandler<IttyRequest>) {
  return async (...args: Parameters<RouteHandler<IttyRequest>>) => {
    const resp = await fun(...args);
    resp.headers.set("Access-Control-Allow-Origin", "*");
    return resp;
  };
}
