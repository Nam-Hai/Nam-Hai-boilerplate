import { createServerApi } from ".."
import { server } from "../config"


export const [getFoo, fetchFoo] = createServerApi("/foo/", async ({ }) => {
    return {}
})

