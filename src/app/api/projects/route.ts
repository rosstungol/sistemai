import { auth } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

export async function GET() {
	const { isAuthenticated, userId } = await auth()
	if (!isAuthenticated || !userId) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const projects = await prisma.project.findMany({
		where: { ownerId: userId },
		orderBy: { createdAt: 'desc' },
	})

	return Response.json(projects)
}

export async function POST(request: NextRequest) {
	const { isAuthenticated, userId } = await auth()
	if (!isAuthenticated || !userId) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { name: rawName, slug: rawSlug } = await request
		.json()
		.catch(() => ({}))

	const name =
		typeof rawName === 'string' && rawName.trim()
			? rawName.trim()
			: 'Untitled Project'

	const slug =
		typeof rawSlug === 'string' && rawSlug.trim()
			? rawSlug
					.trim()
					.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '')
			: name
					.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') +
				'-' +
				Math.random().toString(36).substring(2, 6)

	try {
		const project = await prisma.project.create({
			data: { ownerId: userId, name, slug },
		})
		return Response.json(project, { status: 201 })
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return Response.json(
				{ error: 'A project with this slug already exists' },
				{ status: 409 }
			)
		}
		throw error
	}
}
