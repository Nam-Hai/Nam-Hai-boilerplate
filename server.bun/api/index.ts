import { createServerApi } from ".."
import { server } from "../config"


export type LevelsData = {
    id: number
    levels: {
        id: number,
        name: string
    }[]
}
const readLevels = async () => {
    const file = Bun.file(server.json)
    const data: LevelsData = await file.json()
    return data
}

export const [getLevels, fetchLevels] = createServerApi("/levels/", async () => {
    const data = await readLevels()
    return data.levels
})

export const [addlevel, fetchAddLevel] = createServerApi("/add/", async (body: { name: string }) => {
    const data = await readLevels()
    data.id++
    data.levels.push({
        id: data.id,
        name: body.name
    })
    Bun.write(server.json, JSON.stringify(data))
    return data.levels
})

export const [removeLevel, fetchRemoveLevel, nuxtfetchTest] = createServerApi("/remove/", async (body: { id: number }) => {
    const data = await readLevels()
    data.levels = data.levels.filter(el => el.id !== body.id)
    Bun.write(server.json, JSON.stringify(data))
    return data.levels
})