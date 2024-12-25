import type { APIRoutes } from "../server.bun/utils/types";
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import { server } from "../server.bun/config"

export async function fetchToServer<Path extends keyof APIRoutes, Query extends APIRoutes[Path]["query"], Payload extends APIRoutes[Path]["payload"]>(path: Path, body: Query) {
    const url = new URL(path, `${server.url}:${server.port}`)
    const fetchResult = await fetch(url.href, {
        method: body !== undefined ? "POST" : "GET",
        headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined
    });
    const data = await fetchResult.json();
    return data as Payload
}

export const fetchToMiddleware = async <
    Path extends keyof APIRoutes, Query extends APIRoutes[Path]["query"], Payload extends APIRoutes[Path]["payload"],
>(
    url: Path,
    body: Query
) => {
    try {
        const options = Object.keys(body).length !== 0 ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        } as const : {
            method: "GET"
        } as const

        const response = await $fetch(url as Parameters<typeof $fetch>[0], options)
        return response as Payload
    } catch {
        throw "something went wront during fetchToMiddleware : " + url
    }
}