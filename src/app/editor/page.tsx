'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditorDialog } from '@/hooks/use-project-dialog'

export default function EditorPage() {
	const { openCreate } = useEditorDialog()

	return (
		<div className='flex h-full w-full flex-col items-center justify-center gap-4'>
			<div className='flex flex-col items-center gap-1'>
				<h1 className='font-medium text-lg text-text-primary'>
					Create a project or open an existing one
				</h1>
				<p className='text-sm text-text-muted'>
					Start a new architecture workspace, or choose a project from the
					sidebar
				</p>
			</div>
			<Button className='gap-2' onClick={openCreate}>
				<Plus className='size-4' />
				New Project
			</Button>
		</div>
	)
}
