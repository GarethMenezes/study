var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.ts
async function handle_upload(request, env, ctx) {
  return new Response("todo: add the upload functionality here", { status: 501 });
}
__name(handle_upload, "handle_upload");
async function search(request, env, ctx) {
  return new Response("We are searching", { status: 200 });
}
__name(search, "search");
var backend_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (pathname.startsWith("/search")) {
      return search(request, env, ctx);
    } else if (pathname.startsWith("/upload")) {
      return handle_upload(request, env, ctx);
    }
    return new Response("Not Found", { status: 404 });
  }
};
export {
  backend_default as default
};
//# sourceMappingURL=index.js.map
