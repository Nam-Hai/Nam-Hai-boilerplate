const stream = new ReadableStream({
    start(controller) {
        controller.enqueue("hello");
        controller.enqueue("world");
        controller.close();
    },
});

const path = "./file.txt";
const response = new Response(stream);

console.log("bun", path);
// await Bun.write(path, response);