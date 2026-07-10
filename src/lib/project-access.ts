import 'server-only'

import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function getCurrentIdentity() {
	const { userId } = await auth()
	if (!userId) return null

	const user = await currentUser()
	const email =
		user?.primaryEmailAddress?.emailAddress ??
		user?.emailAddresses?.[0]?.emailAddress
	if (!email) return null

	return { userId, email }
}

export async function checkProjectAccess(slug: string) {
	const identity = await getCurrentIdentity()
	if (!identity) return null

	const project = await prisma.project.findUnique({
		where: { slug },
		include: {
			collaborators: {
				select: { email: true },
			},
		},
	})

	if (!project) return null

	const isOwner = project.ownerId === identity.userId
	const isCollaborator = project.collaborators.some(
		(c) => c.email.toLowerCase() === identity.email.toLowerCase()
	)

	if (!isOwner && !isCollaborator) return null

	return {
		id: project.id,
		name: project.name,
		slug: project.slug,
		isOwner,
	}
}
