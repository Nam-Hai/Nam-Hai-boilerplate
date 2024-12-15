import { server } from "./config"


export type LevelsData = {
    levels: string[]
}

export const routeServerApiMap = new Map<string, ReturnType<typeof createApi>[0]>()

const readLevels = async () => {
    const file = Bun.file(server.json)
    const data: LevelsData = await file.json()
    return data
}
const apiRoutes: string[] = []

const createApi = <T extends Object, P extends Object | undefined>(path: string, payload: ((data: P) => Promise<T>)) => {

    const url = new URL(path, `${server.url}:${server.port}`)

    const isRequestPayload = (
        payload: ((data: P) => Promise<T>) | (() => Promise<T>)
    ): payload is (data: P) => Promise<T> => {
        return payload.length > 0;
    };

    const frontAPI = async (query?: any): Promise<T> => {
        const fetchResult = await fetch(url.href, {
            method: query !== undefined ? "PUT" : "GET",
            body: query !== undefined ? JSON.stringify(query) : undefined
        });
        const data: T = await fetchResult.json();
        return data
    }


    const serverAPI =
        (async (req?: Request) => {
            if (isRequestPayload(payload)) {
                if (!req) throw "Request object is missing"
                const data = await req.json()
                return Response.json(await payload(data))
            } else {
                return Response.json(await (payload as () => Promise<T>)())
            }
        })

    apiRoutes.push(path)
    routeServerApiMap.set(path, serverAPI)

    return [serverAPI, frontAPI] as const
}

export const [getLevels, fetchLevels] = createApi("/levels/", async () => {
    const data = await readLevels()
    return data
})

export const [addlevel, fetchAddLevel] = createApi("/add/", async (d: { name: string }) => {
    const data = await readLevels()
    data.levels.push(d.name)
    Bun.write(server.json, JSON.stringify(data))
    return data
})


Bun.write("./types.d.ts", `declare type APIRoutes = ${apiRoutes.map(el => `"${el}"`).join(" | ")}`)