const server = {
    url: "http://0.0.0.0",
    port: 444
}

const path = "./levels.json"
const file = Bun.file(path)
export type LevelsData = {
    levels: string[]
}
const levels: LevelsData = await file.json()

const createApi = <T extends Object, P extends ((req: Request) => Promise<T>) | (() => T)>(path: string, payload: P) => {
    const url = new URL(path, `${server.url}:${server.port}`)

    const isRequestPayload = (
        payload: ((req: Request) => Promise<T>) | (() => T)
    ): payload is (req: Request) => Promise<T> => {
        return payload.length > 0;
    };

    const frontAPI = async (query: T) => {
        const fetchResult = await fetch(url.href, {
            method: query !== undefined ? "PUT" : "GET",
            body: query !== undefined ? JSON.stringify(query) : undefined
        });
        const data: T = await fetchResult.json();
        return data
    }

    type ServerAPIReturn<T, W> = W extends (req: Request) => Promise<T>
        ? (req: Request) => Promise<Response>
        : () => Response;

    const serverAPI: ServerAPIReturn<T, P> = isRequestPayload(payload) ?
        (async (req) => {
            return Response.json(await payload(req))
        }) as ServerAPIReturn<T, typeof payload>
        : (() => {
            return Response.json(payload());
        }) as ServerAPIReturn<T, typeof payload>

    return [serverAPI, frontAPI] as const
}

export const [getLevels, fetchLevels] = createApi("/levels/", () => {
    return levels
})

export const [addlevel, fetchAddLevel] = createApi("/add/", async (req: Request) => {
    const data: { name: string } = await req.json();
    levels.levels.push(data.name)
    Bun.write(path, JSON.stringify(levels))

    return data;
})


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
                return await addlevel(req)

            } catch {
                console.log('fail');
            }
        }



        return new Response("404!");
    },
});
console.log(`Listening on http://localhost:${server.port} ...`);