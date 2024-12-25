import { routeServerApiMap } from "./utils/createServerApi";
import { server } from "./config";
import { compiler } from "./utils/compiler";
import { readdirSync } from "fs";
import { join } from "path";

// Dynamically import all route files
const routesDir = join(import.meta.dir, "api");
const files = readdirSync(routesDir).filter((file) => file.endsWith(".ts"));
for (const file of files) {
    await import(join(routesDir, file));
}

Bun.serve({
    port: server.port,
    async fetch(req) {
        const url = new URL(req.url);
        console.log("server url : ", url.pathname, req);

        if (routeServerApiMap.has(url.pathname)) {
            return await routeServerApiMap.get(url.pathname)!(req)
        }

        return new Response("404!");
    },
});

console.log(`server at ${server.url}`)

// compile APIRoutes Type in ./utils/types.ts
compiler()