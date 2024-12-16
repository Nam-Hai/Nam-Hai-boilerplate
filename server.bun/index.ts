import { server } from "./config"
import { nuxtFetch } from "../utils/utils"

export const routeServerApiMap = new Map<string, ReturnType<typeof createServerApi>[0]>()

export const apiRoutes: string[] = []

export const createServerApi = <T extends Object, P extends Object | undefined>(path: string, payload: ((data: P) => Promise<T>)) => {

    const url = new URL(path, `${server.url}:${server.port}`)

    const isRequestPayload = (
        payload: ((data: P) => Promise<T>) | (() => Promise<T>)
    ): payload is (data: P) => Promise<T> => {
        return payload.length > 0;
    };

    const middlewareAPI = async (body: P): Promise<T> => {
        const fetchResult = await fetch(url.href, {
            method: body !== undefined ? "POST" : "GET",
            headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
            body: body !== undefined ? JSON.stringify(body) : undefined
        });
        const data: T = await fetchResult.json();
        return data
    }

    const frontAPI = async (args: Parameters<ReturnType<typeof nuxtFetch>>[0], body: P) => {
        const response = await fetch(args,
            {
                method: body !== undefined ? "POST" : "GET",
                headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
                body: body !== undefined ? JSON.stringify(body) : undefined
            })
        return await response.json()
    }

    const serverAPI =
        (async (req?: Request) => {
            if (isRequestPayload(payload)) {
                if (!req) throw "Request object is missing"
                const json = await req.json()
                return Response.json(await payload(json))
            } else {
                return Response.json(await (payload as () => Promise<T>)())
            }
        })

    apiRoutes.push(path)
    routeServerApiMap.set(path, serverAPI)

    return [serverAPI, middlewareAPI, frontAPI] as const
}
