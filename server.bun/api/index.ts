import { createServerApi } from "../utils/createServerApi"
import { server } from "../config"
import { usePrisma } from "../utils/usePrisma"
import { z } from "zod"
import { CategorySchema, PostSchema } from "../prisma/generated/zod"


export const getFoo = createServerApi("/api/foo/", async ({ }) => {
    return {}
}, z.object({}), z.object({}))

createServerApi("/api/createCategory", async (query: { name: string }) => {
    const prisma = usePrisma()

    return await prisma.category.create({
        data: {
            name: query.name,
        }
    })
}, z.object({ name: z.string() }), CategorySchema)

createServerApi("/api/deleteCategory", async (query: { id: number }) => {
    const prisma = usePrisma()

    const deletedReturn = await prisma.category.delete({
        where: {
            id: query.id
        }
    })
    return deletedReturn
}, z.object({ id: z.number() }), CategorySchema)

createServerApi("/api/getCategories", async () => {
    const prisma = usePrisma()

    return {
        categories: await prisma.category.findMany()
    }
}, z.object({}), z.object({ categories: z.array(CategorySchema) }))

createServerApi("/api/createPost", async (query: { title: string, content: string, categoryId: number }) => {
    const prisma = usePrisma()

    return await prisma.post.create({
        data: {
            title: query.title,
            content: query.content,
            categoryId: query.categoryId
        }
    })
}, PostSchema, PostSchema)

createServerApi("/api/getPosts", async (query: { categoryId: number }) => {
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