import { fetchLevels } from "~/server.bun/index";

export default defineEventHandler(async (event) => {
  try {
    const f = await fetchLevels()
    return f
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Failed to fetch data' });
  }
})
