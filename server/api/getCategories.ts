import { fetchToServer } from "~/utils/frontApi"

export default defineEventHandler(async (event) => {
    return await fetchToServer("/api/getCategories", {})
})