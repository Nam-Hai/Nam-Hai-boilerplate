export function loadTexture(texture: any, src: string) {
    const image = new Image()
    image.src = src
    image.crossOrigin = 'anonymous'
    image.onload = () => {
        texture.image = image
    }
}

let id = 0
export function getUId() {
    const uId = [
        Math.floor(id % 256) / 256,
        Math.floor((id % (256 * 256)) / (256)) / 256,
        Math.floor((id % (256 * 256 * 256)) / (256 * 256)),
        Math.floor((id % (256 * 256 * 256 * 256)) / (256 * 256 * 256))
    ]
    id++
    return uId

}