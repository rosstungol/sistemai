import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL ?? ''

const createPrismaClient = () => {
	if (databaseUrl.startsWith('prisma+postgres://')) {
		return new PrismaClient({ accelerateUrl: databaseUrl })
	}

	const pool = new Pool({ connectionString: databaseUrl })
	const adapter = new PrismaPg(pool)
	return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma
}
