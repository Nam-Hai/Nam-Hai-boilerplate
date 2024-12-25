import { createServerApi } from "../utils/createServerApi"
import { server } from "../config"
import { usePrisma } from "../utils/usePrisma"
import { z } from "zod"
import { CategorySchema, PostSchema } from "../prisma/generated/zod"


export const getFoo = createServerApi("/foo/", async ({ }) => {
    return {}
}, z.object({}), z.object({}))

export const createCategory = createServerApi("/createCategory", async (query: { name: string }) => {
    const prisma = usePrisma()

    return await prisma.category.create({
        data: {
            name: query.name,
        }
    })
}, z.object({ name: z.string() }), z.object({ name: z.string() }))

export const getAllCategories = createServerApi("/getCategories", async () => {
    const prisma = usePrisma()

    return {
        categories: await prisma.category.findMany()
    }
}, z.object({}), z.object({ categories: z.array(CategorySchema) }))

export const createPost = createServerApi("/createPost", async (query: { title: string, content: string, categoryId: number }) => {
    const prisma = usePrisma()

    return await prisma.post.create({
        data: {
            title: query.title,
            content: query.content,
            categoryId: query.categoryId
        }
    })
}, PostSchema, PostSchema)

export const getPosts = createServerApi("/getPosts", async (query: { categoryId: number }) => {
    const prisma = usePrisma()

    const payload = await prisma.category.findFirst({
        where: {
            id: query.categoryId
        },
        select: {
            posts: true
        }
    })

    return {
        posts: payload?.posts || []
    }
}, PostSchema.pick({ categoryId: true }), z.object({ posts: z.array(PostSchema) }))