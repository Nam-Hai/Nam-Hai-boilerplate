import { addlevel, getLevels } from ".";
import { server } from "./config";


Bun.serve({
    port: server.port,
    async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === "/add/") {
            return await addlevel(req)

        } else if (url.pathname === "/levels/") {
            return await getLevels()
        }



        return new Response("404!");
    },
});