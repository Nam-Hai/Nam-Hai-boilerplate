import type { BunRep } from "~/server.bun";
export default defineEventHandler(async (event) => {
  // const a = await fetch("localhost:444")
  try {
    const a = await fetch("http://0.0.0.0:444"); // Add the protocol
    const data: BunRep = await a.json(); // Assuming the response is JSON
    // console.log(a.text);
    return {
      hello: 'world',
      data,
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Failed to fetch data' });
  }
})
