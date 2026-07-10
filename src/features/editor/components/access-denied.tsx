import { Lock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AccessDenied() {
	return (
		<div className='flex h-full w-full flex-col items-center justify-center gap-4 p-4'>
			<div className='flex size-12 items-center justify-center rounded-2xl bg-bg-subtle'>
				<Lock className='size-6 text-text-muted' />
			</div>
			<div className='flex flex-col items-center gap-1 text-center'>
				<h1 className='font-medium text-lg text-text-primary'>Access Denied</h1>
				<p className='text-sm text-text-muted'>
					You don&apos;t have access to this project.
				</p>
			</div>
			<Link href='/editor'>
				<Button variant='outline'>Back to Editor</Button>
			</Link>
		</div>
	)
}
