import { Texture, type OGLRenderingContext } from "ogl";
import { useOGL } from "~/lib/webGL/ogl.renderer/useOGL";
import JsWebm from "jswebm/src/JsWebm"
import type { ShallowReactive, ShallowRef } from "vue";


export class WebGLVideoDecoder {
    reader: ReadableStreamDefaultReader<any>;
    decoder: VideoDecoder;
    gl: OGLRenderingContext;
    videoPackes: { data: ArrayBuffer; isKeyFrame?: boolean; keyframeTimestamp: number; timestamp: number; }[];
    textures: ShallowReactive<Texture[]>;


    constructor(gl: OGLRenderingContext, buffer: ArrayBuffer) {

        this.gl = gl
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(new Uint8Array(buffer));
                controller.close();
            }
        });
        this.reader = stream.getReader();


        N.Bind(this, ["handleFrame"])
        this.decoder = new window.VideoDecoder({
            output: this.handleFrame,
            error: (e) => console.error('Decoder error:', e)
        });

        this.decoder.configure({
            // codec: 'vp8', // Or 'vp9', 'avc1.42E01E', 'av01.0.05M.08', etc.
            // codec: 'avc1.42E01E', // H.264 Baseline profile
            // codec: "vp9",
            codec: "vp09.00.10.08",
            optimizeForLatency: true
        });
        const demuxer = new JsWebm();
        demuxer.queueData(buffer);
        while (!demuxer.eof) {
            demuxer.demux();
        }
        this.videoPackes = demuxer.videoPackets as { data: ArrayBuffer, isKeyFrame?: boolean, keyframeTimestamp: number, timestamp: number }[]


        console.log(demuxer)
        console.log(`total video packets : ${demuxer.videoPackets.length}`);
        console.log(`total audio packets : ${demuxer.audioPackets.length}`);

        this.feedDecoder()


        this.textures = shallowReactive([])
    }

    async handleFrame(videoFrame: VideoFrame) {
        // console.log("HANDLE FRAME", videoFrame, this.createTextureFromVideoFrame)
        const texture = await this.createTextureFromVideoFrame(videoFrame);
        this.textures.push(texture)

        videoFrame.close(); // Important to free memory
    }

    async createTextureFromVideoFrame(frame: VideoFrame) {
        const width = frame.displayWidth;
        const height = frame.displayHeight;
        const buffer = new Uint8Array(width * height * 4); // RGBA

        await frame.copyTo(buffer, { format: 'RGBA' });

        const texture = new Texture(this.gl, {
            image: buffer,
            height,
            width
        })
        // Store the texture
        // this.textures.push(texture);


        return texture;
    }

    async feedDecoder() {
        // const { value, done } = await this.reader.read();
        // console.log("reader read", value, done)
        // if (!done) {
        //
        //     const chunk = new EncodedVideoChunk({
        //         timestamp: 0,
        //         type: 'key',
        //         data: value
        //     })
        //     console.log(chunk)
        //     this.decoder.decode(chunk);
        // }


        // for (const packet of this.videoPackes) {
        for (let index = 0; index < this.videoPackes.length; index++) {
            const packet = this.videoPackes[index]

            // console.log(packet)
            const chunk = new EncodedVideoChunk({
                type: index === 0 ? 'key' : "delta",
                timestamp: packet.timestamp * 1000,
                // data: packet.data

                data: packet.data,
                // timestamp: 0,
                // type: "key"
            })
            this.decoder.decode(chunk);
        }
    }
}
