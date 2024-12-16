import { fetchLevels } from "~/server.bun/api";

export default defineEventHandler(async (event) => {
  try {
    console.log("getLevels");
    const f = await fetchLevels()
    console.log("getLevels", f);
    return f
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Failed to fetch data' });
  }
})
