import { createServerApi } from "../utils/createServerApi"
import { server } from "../config"
import { usePrisma } from "../utils/usePrisma"
import { z } from "zod"
import { CategorySchema, PostSchema } from "../prisma/generated/zod"


export const getFoo = createServerApi("/api/foo/", async ({ }) => {
    return {}
}, z.object({}), z.object({}))

createServerApi("/api/createCategory", async (query) => {
    const prisma = usePrisma()

    return await prisma.category.create({
        data: {
            name: query.name,
        }
    })
}, z.object({ name: z.string() }), CategorySchema)

createServerApi("/api/deleteCategory", async (query) => {
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

createServerApi("/api/createPost", async (query) => {
    const prisma = usePrisma()

    return await prisma.post.create({
        data: {
            title: query.title,
            content: query.content,
            categoryId: query.categoryId
        }
    })
}, PostSchema, PostSchema)

createServerApi("/api/getPosts", async (query) => {
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

createServerApi("/api/test", async (query) => {
    return 2
}, z.object({
    // inst: z.instanceof(Test),
    // stringlit: z.custom<`${number}px`>(() => true),
    map: z.map(z.string(), z.object({ foo: z.boolean() })),
    set: z.set(z.object({ name: z.string(), foo: z.boolean() })),
    num: z.number(),
    tup: z.tuple([z.string(), z.number()]),
    str: z.string().nullish(),
    prom: z.promise(z.string()),
    promObj: z.promise(z.object({ name: z.string() })),
    obj: z.record(z.string(), z.object({ name: z.string() })),
    choco: z.array(z.object({ test: z.union([z.boolean(), z.array(z.number().nullable()), z.number().nullable()]), yo: z.null(), tup: z.array(z.tuple([z.string(), z.number(), z.object({ cho: z.array(z.number()).nullable() }).nullable()]).nullable()).nullable().optional(), lit: z.literal("test") })).optional()
}), z.number())
// }, z.object({ choco: z.object({ test: z.number().or(z.object({ inner: z.string() })).optional(), yo: z.nan().optional(), lit: z.literal("test").or(z.literal("yo")) }).optional(), andTest: z.intersection(z.number(), z.string()) }), z.number())
