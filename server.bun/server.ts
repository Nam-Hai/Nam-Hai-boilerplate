import { apiRoutes, routeServerApiMap } from ".";
import { fetchAddLevel } from "./api";
import { server } from "./config";

console.log(fetchAddLevel);

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


Bun.write("./types.d.ts", `declare type APIRoutes = ${apiRoutes.map(el => `"${el}"`).join(" | ")}`)
console.log(`server at ${server.url}`)

Bun.write("./fetch.ts", ``)
