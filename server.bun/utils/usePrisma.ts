import { createState } from "../../utils/createState.ts"
import { PrismaClient } from '@prisma/client'

export const usePrisma = createState(() => {
    const prisma = new PrismaClient()
    return prisma
})