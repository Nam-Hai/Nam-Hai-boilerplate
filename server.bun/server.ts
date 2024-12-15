import { addlevel, getLevels, routeServerApiMap } from ".";
import { server } from "./config";



Bun.serve({
    port: server.port,
    async fetch(req) {
        const url = new URL(req.url);

        if (routeServerApiMap.has(url.pathname)) {
            return await routeServerApiMap.get(url.pathname)!(req)
        }

        return new Response("404!");
    },
});
