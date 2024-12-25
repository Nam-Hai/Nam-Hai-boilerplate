import { routeServerApiMap } from "./utils/createServerApi";
import { server } from "./config";
import { compiler } from "./utils/compiler";
import { getFoo } from "./api";

// dont comment this line, it break stuff pls because of treeshacking
console.log(getFoo, routeServerApiMap.get("/foo/"));

Bun.serve({
    port: server.port,
    async fetch(req) {
        const url = new URL(req.url);
        console.log("server url : ", url.pathname, routeServerApiMap);

        if (routeServerApiMap.has(url.pathname)) {
            return await routeServerApiMap.get(url.pathname)!(req)
        }

        return new Response("404!");
    },
});

console.log(`server at ${server.url}`)

compiler()