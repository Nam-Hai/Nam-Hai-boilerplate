import { z } from "zod"
import { fetchToServer } from "~/utils/frontApi"

export default defineEventHandler(async (event) => {
    const query = await readBody(event)

    const schema = z.object({ name: z.string() })
    schema.parse(query)

    type queryType = z.infer<typeof schema>

    return await fetchToServer("/api/createCategory", query as queryType)
})