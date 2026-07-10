import { auth, clerkClient } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

type CollaboratorResponse = {
	id: string
	email: string
	displayName: string | null
	avatarUrl: string | null
	createdAt: Date
}

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ projectId: string }> }
) {
	const { isAuthenticated, userId } = await auth()
	if (!isAuthenticated || !userId) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { projectId } = await params

	const project = await prisma.project.findUnique({
		where: { id: projectId },
		include: {
			collaborators: {
				orderBy: { createdAt: 'asc' },
			},
		},
	})

	if (!project) {
		return Response.json({ error: 'Not found' }, { status: 404 })
	}

	const isOwner = project.ownerId === userId
	if (!isOwner) {
		const client = await clerkClient()
		const requester = await client.users.getUser(userId)
		const requesterEmails = requester.emailAddresses.map((e) =>
			e.emailAddress.toLowerCase()
		)
		const isCollaborator = project.collaborators.some((c) =>
			requesterEmails.includes(c.email.toLowerCase())
		)
		if (!isCollaborator) {
			return Response.json({ error: 'Forbidden' }, { status: 403 })
		}
	}

	const emails = project.collaborators.map((c) => c.email)
	const enrichedEmails = new Set<string>()

	const userMap: Record<
		string,
		{ firstName: string | null; lastName: string | null; imageUrl: string }
	> = {}

	try {
		const clerk = await clerkClient()
		const users = await clerk.users.getUserList({
			emailAddress: emails,
			limit: 100,
		})

		for (const u of users.data) {
			const primaryEmail = u.emailAddresses?.[0]?.emailAddress
			if (primaryEmail) {
				enrichedEmails.add(primaryEmail.toLowerCase())
				userMap[primaryEmail.toLowerCase()] = {
					firstName: u.firstName,
					lastName: u.lastName,
					imageUrl: u.imageUrl,
				}
			}
		}
	} catch {
		// Fall through — show email only if Clerk lookup fails
	}

	const collaborators: CollaboratorResponse[] = project.collaborators.map(
		(c) => {
			const match = userMap[c.email.toLowerCase()]
			if (match) {
				return {
					id: c.id,
					email: c.email,
					displayName:
						[match.firstName, match.lastName].filter(Boolean).join(' ') || null,
					avatarUrl: match.imageUrl,
					createdAt: c.createdAt,
				}
			}
			return {
				id: c.id,
				email: c.email,
				displayName: null,
				avatarUrl: null,
				createdAt: c.createdAt,
			}
		}
	)

	return Response.json({ collaborators, isOwner })
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ projectId: string }> }
) {
	const { isAuthenticated, userId } = await auth()
	if (!isAuthenticated || !userId) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { projectId } = await params

	const project = await prisma.project.findUnique({
		where: { id: projectId },
	})

	if (!project) {
		return Response.json({ error: 'Not found' }, { status: 404 })
	}

	if (project.ownerId !== userId) {
		return Response.json({ error: 'Forbidden' }, { status: 403 })
	}

	const body = await request.json().catch(() => ({}))
	const email =
		typeof body.email === 'string' ? body.email.trim().toLowerCase() : undefined

	if (!email || !email.includes('@')) {
		return Response.json(
			{ error: 'A valid email address is required' },
			{ status: 400 }
		)
	}

	try {
		const collaborator = await prisma.projectCollaborator.create({
			data: { projectId, email },
		})
		return Response.json(collaborator, { status: 201 })
	} catch (e) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code === 'P2002'
		) {
			return Response.json(
				{ error: 'This user is already a collaborator' },
				{ status: 409 }
			)
		}
		return Response.json(
			{ error: 'Failed to add collaborator' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ projectId: string }> }
) {
	const { isAuthenticated, userId } = await auth()
	if (!isAuthenticated || !userId) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { projectId } = await params

	const project = await prisma.project.findUnique({
		where: { id: projectId },
	})

	if (!project) {
		return Response.json({ error: 'Not found' }, { status: 404 })
	}

	if (project.ownerId !== userId) {
		return Response.json({ error: 'Forbidden' }, { status: 403 })
	}

	const body = await request.json().catch(() => ({}))
	const collaboratorId =
		typeof body.collaboratorId === 'string' ? body.collaboratorId : undefined

	if (!collaboratorId) {
		return Response.json(
			{ error: 'collaboratorId is required' },
			{ status: 400 }
		)
	}

	const collaborator = await prisma.projectCollaborator.findUnique({
		where: { id: collaboratorId },
	})

	if (!collaborator || collaborator.projectId !== projectId) {
		return Response.json({ error: 'Collaborator not found' }, { status: 404 })
	}

	await prisma.projectCollaborator.delete({
		where: { id: collaboratorId },
	})

	return new Response(null, { status: 204 })
}
