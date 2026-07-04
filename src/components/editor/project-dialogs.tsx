'use client'

import { type KeyboardEvent, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { DialogType } from '@/hooks/use-project-dialog'

type ProjectDialogsProps = {
	dialogType: DialogType
	projectName: string
	onProjectNameChange: (name: string) => void
	slug: string
	loading: boolean
	selectedProjectName?: string
	onClose: () => void
	onCreate: () => void
	onRename: () => void
	onDelete: () => void
}

export function ProjectDialogs({
	dialogType,
	projectName,
	onProjectNameChange,
	slug,
	loading,
	selectedProjectName,
	onClose,
	onCreate,
	onRename,
	onDelete,
}: ProjectDialogsProps) {
	const renameInputRef = useRef<HTMLInputElement>(null)

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && dialogType === 'rename') {
			onRename()
		}
	}

	return (
		<>
			<Dialog
				open={dialogType === 'create'}
				onOpenChange={(open) => !open && onClose()}
			>
				<DialogContent showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>Create Project</DialogTitle>
					</DialogHeader>
					<div className='space-y-2'>
						<Input
							placeholder='Project name'
							value={projectName}
							onChange={(e) => onProjectNameChange(e.target.value)}
						/>
						<p className='text-text-muted text-xs'>
							{projectName ? slug : 'your-project-slug'}
						</p>
					</div>
					<DialogFooter>
						<Button variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button
							onClick={onCreate}
							disabled={!projectName.trim() || loading}
						>
							{loading ? 'Creating...' : 'Create'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={dialogType === 'rename'}
				onOpenChange={(open) => !open && onClose()}
			>
				<DialogContent showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>Rename Project</DialogTitle>
						<DialogDescription>
							Rename &ldquo;{selectedProjectName}&rdquo;
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-2'>
						<Input
							ref={renameInputRef}
							placeholder='Project name'
							value={projectName}
							onChange={(e) => onProjectNameChange(e.target.value)}
							onKeyDown={handleKeyDown}
							autoFocus
						/>
					</div>
					<DialogFooter>
						<Button variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button
							onClick={onRename}
							disabled={!projectName.trim() || loading}
						>
							{loading ? 'Renaming...' : 'Rename'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={dialogType === 'delete'}
				onOpenChange={(open) => !open && onClose()}
			>
				<DialogContent showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>Delete Project</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete &ldquo;{selectedProjectName}
							&rdquo;? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button variant='destructive' onClick={onDelete} disabled={loading}>
							{loading ? 'Deleting...' : 'Delete'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
