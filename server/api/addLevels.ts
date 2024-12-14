export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    console.log(query);

    try {
        const a = await fetch("http://0.0.0.0:444/add/", { 
            method: "PUT",
            body: JSON.stringify(query)
         }); // Add the protocol
        // const data: GetLevelsR = await a.json(); // Assuming the response is JSON
        // // console.log(a.text);
        return {
            hello: "addlevel"
            // data,
        };
    } catch (error) {
        console.error(error);
        throw createError({ statusCode: 500, message: 'Failed to fetch data' });
    }
})

