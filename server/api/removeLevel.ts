import { fetchRemoveLevel } from "~/server.bun/index";

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    try {
        return await fetchRemoveLevel(query)
    } catch (error) {
        console.error(error);
        throw createError({ statusCode: 500, message: 'Failed to fetch data' });
    }
})


