import { server } from "../config"
import { z } from "zod"
import { getRuntimeType } from "./compiler"


export const apiInfo: { path: string, inputType: any, outputType: any }[] = []

export const routeServerApiMap = new Map<string, ReturnType<typeof createServerApi>>()
export const createServerApi = <T extends Object, P extends Object>(path: string, payload: ((data: P) => Promise<T>),
    inputSchema: z.Schema<P>,
    outputSchema: z.Schema<T>
) => {
    const url = new URL(path, `${server.url}:${server.port}`)

    const isRequestPayload = (
        payload: ((data: P) => Promise<T>) | (() => Promise<T>)
    ): payload is (data: P) => Promise<T> => {
        return payload.length > 0;
    };


    const serverAPI =
        (async (req?: Request) => {
            if (isRequestPayload(payload)) {
                if (!req) throw "Request object is missing"
                const json = await req.json()
                inputSchema.parse(json)

                const output = await payload(json)

                outputSchema.parse(output)
                return Response.json(output)
            } else {
                return Response.json(await (payload as () => Promise<T>)())
            }
        })

    apiInfo.push({
        path,
        inputType: getRuntimeType(inputSchema as any as z.AnyZodObject),
        outputType: getRuntimeType(outputSchema as any as z.AnyZodObject)
    })
    routeServerApiMap.set(path, serverAPI)

    return serverAPI
}
