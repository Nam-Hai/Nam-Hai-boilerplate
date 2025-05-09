import MP4Box from 'mp4box';

export function demuxMP4(file) {
  const mp4boxfile = MP4Box.createFile();
  mp4boxfile.onReady = (info) => {
    const videoTrack = info.tracks.find(t => t.video);
    if (!videoTrack) return console.error('No video track found');

    // Set extraction options
    mp4boxfile.setExtractionOptions(videoTrack.id, null, {
      nbSamples: Infinity,
      rapAlignement: true // Align to keyframes
    });

    mp4boxfile.start(); // Begin extraction
  };

  mp4boxfile.onSamples = (id, user, samples) => {
    for (const sample of samples) {
      const chunk = new EncodedVideoChunk({
        type: sample.is_sync ? 'key' : 'delta',
        timestamp: sample.dts, // or pts depending on decoder
        duration: sample.duration,
        data: sample.data
      });
      decoder.decode(chunk); // Use your WebCodecs VideoDecoder
    }
  };

  // Read the file in chunks and feed it to mp4box
  const fileReader = new FileReader();
  let offset = 0;

  fileReader.onload = (e) => {
    const buffer = e.target.result;
    (buffer).fileStart = offset;
    mp4boxfile.appendBuffer(buffer);
    offset += buffer.byteLength;

    if (offset < file.size) {
      readNextChunk();
    } else {
      mp4boxfile.flush();
    }
  };

  function readNextChunk() {
    const slice = file.slice(offset, offset + 1024 * 1024); // 1MB chunks
    fileReader.readAsArrayBuffer(slice);
  }

  readNextChunk(); // Start reading
}
