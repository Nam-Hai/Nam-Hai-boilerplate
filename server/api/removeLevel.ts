import { fetchRemoveLevel } from "~/server.bun/api";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    try {
        console.log("middle ", body);
        return await fetchRemoveLevel(body)
    } catch (error) {
        console.error(error);
        throw createError({ statusCode: 500, message: 'Failed to fetch data' });
    }
})