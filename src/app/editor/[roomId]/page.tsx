import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AccessDenied } from '@/features/editor/components/access-denied'
import { checkProjectAccess } from '@/lib/project-access'

type WorkspacePageProps = {
	params: Promise<{ roomId: string }>
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
	const { roomId } = await params

	const { userId } = await auth()
	if (!userId) {
		redirect('/sign-in')
	}

	const project = await checkProjectAccess(roomId)
	if (!project) {
		return <AccessDenied />
	}

	return (
		<div className='flex h-full w-full flex-col items-center justify-center gap-2 p-4'>
			<div className='flex flex-col items-center gap-1 text-center'>
				<p className='text-sm text-text-muted'>
					Canvas workspace will appear here
				</p>
			</div>
		</div>
	)
}
