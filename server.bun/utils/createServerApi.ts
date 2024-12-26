import { server } from "../config"
import { z } from "zod"


export const apiInfo: { path: string, querySchema: z.ZodType, payloadSchema: z.ZodType }[] = []

export const routeServerApiMap = new Map<string, ReturnType<typeof createServerApi>>()
export const createServerApi = <T extends Object, P extends Object>(path: string, payload: ((data: P) => Promise<T>),
    querySchema: z.ZodType<P>,
    payloadSchema: z.ZodType<T>
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
                querySchema.parse(json)

                const output = await payload(json)

                payloadSchema.parse(output)
                return Response.json(output)
            } else {
                return Response.json(await (payload as () => Promise<T>)())
            }
        })

    apiInfo.push({
        path,
        querySchema: querySchema,
        payloadSchema: payloadSchema
    })
    routeServerApiMap.set(path, serverAPI)

    return serverAPI
}
