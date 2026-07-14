import { auth, currentUser } from '@clerk/nextjs/server'
import {
	authorizeUser,
	ensureRoomExists,
	getCursorColor,
} from '@/lib/liveblocks'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
	const { isAuthenticated, userId } = await auth()
	if (!isAuthenticated || !userId) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { roomId } = await request.json().catch(() => ({}))
	if (typeof roomId !== 'string' || !roomId) {
		return Response.json({ error: 'Room ID is required' }, { status: 400 })
	}

	const project = await prisma.project.findUnique({
		where: { id: roomId },
		include: {
			collaborators: { select: { email: true } },
		},
	})

	if (!project) {
		return Response.json({ error: 'Not found' }, { status: 404 })
	}

	const isOwner = project.ownerId === userId
	const user = await currentUser()
	const email =
		user?.primaryEmailAddress?.emailAddress ??
		user?.emailAddresses?.[0]?.emailAddress
	const isCollaborator =
		!!email &&
		project.collaborators.some(
			(c) => c.email.toLowerCase() === email.toLowerCase()
		)

	if (!isOwner && !isCollaborator) {
		return Response.json({ error: 'Forbidden' }, { status: 403 })
	}

	const cursorColor = getCursorColor(userId)

	await ensureRoomExists(roomId)

	const { token } = await authorizeUser({
		roomId,
		userId,
		userInfo: {
			name: user?.fullName ?? email ?? userId,
			avatar: user?.imageUrl ?? '',
			cursorColor,
		},
	})

	return Response.json({ token })
}
