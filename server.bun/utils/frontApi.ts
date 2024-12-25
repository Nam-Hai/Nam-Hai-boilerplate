import type { APIRoutes } from "./types";
import { server } from "../config"

// const middlewareAPI = async <P, T>(path: APIRoutes, body: P): Promise<T> => {

//     const url = new URL(path, `${server.url}:${server.port}`)
//     const fetchResult = await fetch(url.href, {
//         method: body !== undefined ? "POST" : "GET",
//         headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
//         body: body !== undefined ? JSON.stringify(body) : undefined
//     });
//     const data: T = await fetchResult.json();
//     return data
// }

async function fetchToBunServer<Path extends keyof APIRoutes>(path: Path, body: APIRoutes[Path]) {
    const url = new URL(path, `${server.url}:${server.port}`)
    const fetchResult = await fetch(url.href, {
        method: body !== undefined ? "POST" : "GET",
        headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined
    });
    const data = await fetchResult.json();
    return data
}