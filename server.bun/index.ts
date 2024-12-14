const server = {
    port: 444
}

const path = "./levels.json"
const file = Bun.file(path)
const levels: GetLevelsR = await file.json()

Bun.serve({
    port: server.port,
    static: {
        "/levels/": getLevels()
    },
    async fetch(req) {
        const url = new URL(req.url);

        console.log(req, url);
        // For JSON data
        if (url.pathname === "/add/") {
            try {

                const data = await req.json();
                console.log(data, levels);
                levels.levels.push(data.name)
                Bun.write(path, JSON.stringify(levels))

                return Response.json(data);
            } catch {
                console.log('fail');
            }
        }



        return new Response("404!");
    },
});

export type GetLevelsR = {
    levels: string[]
}
function getLevels() {
    return Response.json({
        levels
    });
}

console.log(`Listening on http://localhost:${server.port} ...`);