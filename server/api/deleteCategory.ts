import { z } from "zod"
import { fetchToServer } from "~/utils/frontApi"

export default defineEventHandler(async (event) => {
    const { id } = await readBody(event)

    const body = { id: +id }
    const schema = z.object({ id: z.number() })
    schema.parse(body)

    type queryType = z.infer<typeof schema>
    return await fetchToServer("/api/deleteCategory", body as queryType)
})