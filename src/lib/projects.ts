import 'server-only'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export type ProjectData = {
	id: string
	name: string
	slug: string
	isOwner: boolean
}

export async function getUserProjects(): Promise<{
	owned: ProjectData[]
	shared: ProjectData[]
}> {
	const { userId } = await auth()
	if (!userId) {
		return { owned: [], shared: [] }
	}

	const [owned, shared] = await Promise.all([
		prisma.project.findMany({
			where: { ownerId: userId },
			orderBy: { createdAt: 'desc' },
		}),
		prisma.project.findMany({
			where: {
				collaborators: {
					some: {},
				},
			},
			orderBy: { createdAt: 'desc' },
		}),
	])

	return {
		owned: owned.map((p) => ({
			id: p.id,
			name: p.name,
			slug: p.slug ?? p.id,
			isOwner: true,
		})),
		shared: shared
			.filter((p) => p.ownerId !== userId)
			.map((p) => ({
				id: p.id,
				name: p.name,
				slug: p.slug ?? p.id,
				isOwner: false,
			})),
	}
}
