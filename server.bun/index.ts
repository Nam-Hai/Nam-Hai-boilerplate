export type BunRep = {
    fromServer: string
}
const server = Bun.serve({
    port: 444,
    fetch(req) {
        console.log(req);
        
        return Response.json({
            fromServer: 'hello world'
        });
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);