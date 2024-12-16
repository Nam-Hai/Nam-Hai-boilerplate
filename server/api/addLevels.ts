import { fetchAddLevel } from "~/server.bun/api";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    try {
        return await fetchAddLevel(body)
    } catch (error) {
        console.error(error);
        throw createError({ statusCode: 500, message: 'Failed to fetch data' });
    }
})

